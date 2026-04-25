package com.project.reclamations.service;

import com.project.reclamations.dto.request.ReclamationRequestDTO;
import com.project.reclamations.dto.request.SuiviReclamationRequestDTO;
import com.project.reclamations.dto.response.ReclamationResponseDTO;
import com.project.reclamations.dto.response.SuiviReclamationResponseDTO;
import com.project.reclamations.entity.AgentSAV;
import com.project.reclamations.entity.Client;
import com.project.reclamations.entity.Produit;
import com.project.reclamations.entity.Reclamation;
import com.project.reclamations.entity.SuiviReclamation;
import com.project.reclamations.enums.ActionSuivi;
import com.project.reclamations.enums.RootCauseReclamation;
import com.project.reclamations.enums.StatutReclamation;
import com.project.reclamations.exception.ResourceNotFoundException;
import com.project.reclamations.mapper.ReclamationMapper;
import com.project.reclamations.mapper.SuiviReclamationMapper;
import com.project.reclamations.repository.AgentSAVRepository;
import com.project.reclamations.repository.ClientRepository;
import com.project.reclamations.repository.ProduitRepository;
import com.project.reclamations.repository.ReclamationRepository;
import com.project.reclamations.repository.SuiviReclamationRepository;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.LinkedHashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ReclamationService {

    private static final DateTimeFormatter REPORT_FILE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss");

    private final ReclamationRepository reclamationRepository;
    private final ClientRepository clientRepository;
    private final ProduitRepository produitRepository;
    private final AgentSAVRepository agentSAVRepository;
    private final SuiviReclamationRepository suiviReclamationRepository;
    private final ReclamationMapper reclamationMapper;
    private final SuiviReclamationMapper suiviReclamationMapper;

    @Transactional(readOnly = true)
    public List<ReclamationResponseDTO> getAllReclamations() {
        return reclamationRepository.findAll()
                .stream()
                .map(reclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ReclamationResponseDTO getReclamationById(Long id) {
        Reclamation reclamation = findReclamationById(id);
        return reclamationMapper.toResponseDTO(reclamation);
    }

    public ReclamationResponseDTO createReclamation(ReclamationRequestDTO requestDTO) {
        Client client = clientRepository.findById(requestDTO.getClientId())
                .orElseThrow(() -> new ResourceNotFoundException("Client introuvable avec l'id : " + requestDTO.getClientId()));

        Produit produit = produitRepository.findById(requestDTO.getProduitId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit introuvable avec l'id : " + requestDTO.getProduitId()));

        AgentSAV agentAssigne = null;
        if (requestDTO.getAgentAssigneId() != null) {
            agentAssigne = agentSAVRepository.findById(requestDTO.getAgentAssigneId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + requestDTO.getAgentAssigneId()));
        }

        Reclamation reclamation = Reclamation.builder()
                .description(requestDTO.getDescription())
                .note(requestDTO.getNote())
            .priorite(requestDTO.getPriorite())
            .canalOrigine(requestDTO.getCanalOrigine())
                .slaDueAt(requestDTO.getSlaDueAt())
                .rootCause(requestDTO.getRootCause())
                .reopenCount(0)
                .client(client)
                .produit(produit)
                .agentAssigne(agentAssigne)
                .build();

        Reclamation saved = reclamationRepository.save(reclamation);

        createSuivi(saved, agentAssigne, ActionSuivi.CREATED, "Reclamation creee", null, saved.getStatut(), null);
        if (agentAssigne != null) {
            createSuivi(saved, agentAssigne, ActionSuivi.ASSIGNED, "Reclamation assignee a un agent", saved.getStatut(), saved.getStatut(), null);
        }

        return reclamationMapper.toResponseDTO(saved);
    }

    public ReclamationResponseDTO assignAgent(Long reclamationId, Long agentId) {
        Reclamation reclamation = findReclamationById(reclamationId);
        AgentSAV agent = agentSAVRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + agentId));

        StatutReclamation statutAvant = reclamation.getStatut();
        reclamation.setAgentAssigne(agent);
        if (reclamation.getStatut() == StatutReclamation.OUVERTE) {
            reclamation.setStatut(StatutReclamation.EN_COURS);
        }

        Reclamation updated = reclamationRepository.save(reclamation);
        createSuivi(updated, agent, ActionSuivi.ASSIGNED, "Agent assigne a la reclamation", statutAvant, updated.getStatut(), null);

        return reclamationMapper.toResponseDTO(updated);
    }

    public ReclamationResponseDTO updateStatut(Long reclamationId, StatutReclamation nouveauStatut, String message, Integer timeSpentMinutes) {
        Reclamation reclamation = findReclamationById(reclamationId);
        StatutReclamation statutAvant = reclamation.getStatut();

        boolean wasClosedState = statutAvant == StatutReclamation.RESOLUE || statutAvant == StatutReclamation.FERMEE;
        boolean isReopenedState = nouveauStatut == StatutReclamation.OUVERTE || nouveauStatut == StatutReclamation.EN_COURS;
        if (wasClosedState && isReopenedState) {
            Integer currentReopenCount = reclamation.getReopenCount() == null ? 0 : reclamation.getReopenCount();
            reclamation.setReopenCount(currentReopenCount + 1);
        }

        reclamation.setStatut(nouveauStatut);
        if (nouveauStatut == StatutReclamation.RESOLUE || nouveauStatut == StatutReclamation.FERMEE) {
            if (reclamation.getDateResolution() == null) {
                reclamation.setDateResolution(LocalDateTime.now());
            }
        } else {
            reclamation.setDateResolution(null);
        }
        Reclamation updated = reclamationRepository.save(reclamation);

        ActionSuivi action = mapStatutToAction(nouveauStatut);
        String suiviMessage = message == null || message.isBlank()
                ? "Statut mis a jour vers " + nouveauStatut.name()
                : message;

        createSuivi(updated, updated.getAgentAssigne(), action, suiviMessage, statutAvant, nouveauStatut, timeSpentMinutes);

        return reclamationMapper.toResponseDTO(updated);
    }

    @Transactional(readOnly = true)
    public List<SuiviReclamationResponseDTO> getSuivisByReclamation(Long reclamationId) {
        findReclamationById(reclamationId);

        return suiviReclamationRepository.findByReclamationIdOrderByDateActionAsc(reclamationId)
                .stream()
                .map(suiviReclamationMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public SuiviReclamationResponseDTO addSuivi(Long reclamationId, SuiviReclamationRequestDTO requestDTO) {
        Reclamation reclamation = findReclamationById(reclamationId);

        AgentSAV agentAuteur = null;
        if (requestDTO.getAgentAuteurId() != null) {
            agentAuteur = agentSAVRepository.findById(requestDTO.getAgentAuteurId())
                    .orElseThrow(() -> new ResourceNotFoundException("Agent SAV introuvable avec l'id : " + requestDTO.getAgentAuteurId()));
        }

        SuiviReclamation saved = createSuivi(
                reclamation,
                agentAuteur,
                requestDTO.getAction(),
            requestDTO.getMessage(),
            reclamation.getStatut(),
            reclamation.getStatut(),
            requestDTO.getTimeSpentMinutes()
        );

        return suiviReclamationMapper.toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRapportSatisfaction() {
        return getRapportSatisfaction(null, null);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getRapportSatisfaction(LocalDate fromDate, LocalDate toDate) {
        validateDateRange(fromDate, toDate);
        List<Reclamation> reclamations = findReclamationsForReport(fromDate, toDate);

        long total = reclamations.size();
        long totalNotees = reclamations.stream().filter(r -> r.getNote() != null).count();
        double moyenne = reclamations.stream()
                .filter(r -> r.getNote() != null)
                .mapToInt(Reclamation::getNote)
                .average()
                .orElse(0.0);

        long openCount = reclamations.stream()
            .filter(r -> r.getStatut() == StatutReclamation.OUVERTE || r.getStatut() == StatutReclamation.EN_COURS)
            .count();
        long resolvedCount = reclamations.stream().filter(r -> r.getStatut() == StatutReclamation.RESOLUE).count();
        long closedCount = reclamations.stream().filter(r -> r.getStatut() == StatutReclamation.FERMEE).count();
        long criticalOpen = reclamations.stream()
            .filter(r -> r.getPriorite() != null && r.getPriorite().name().equals("CRITIQUE"))
            .filter(r -> r.getStatut() == StatutReclamation.OUVERTE || r.getStatut() == StatutReclamation.EN_COURS)
            .count();

        LocalDateTime now = LocalDateTime.now();
        long overdueOpen = reclamations.stream()
            .filter(r -> (r.getStatut() == StatutReclamation.OUVERTE || r.getStatut() == StatutReclamation.EN_COURS))
            .filter(r -> r.getSlaDueAt() != null && r.getSlaDueAt().isBefore(now))
            .count();

        long resolvedWithSla = reclamations.stream()
            .filter(r -> (r.getStatut() == StatutReclamation.RESOLUE || r.getStatut() == StatutReclamation.FERMEE))
            .filter(r -> r.getSlaDueAt() != null && r.getDateResolution() != null)
            .count();

        long resolvedInSla = reclamations.stream()
            .filter(r -> (r.getStatut() == StatutReclamation.RESOLUE || r.getStatut() == StatutReclamation.FERMEE))
            .filter(r -> r.getSlaDueAt() != null && r.getDateResolution() != null)
            .filter(r -> !r.getDateResolution().isAfter(r.getSlaDueAt()))
            .count();

        double slaComplianceRate = resolvedWithSla > 0 ? (resolvedInSla * 100.0) / resolvedWithSla : 0.0;

        long reopenedTickets = reclamations.stream().filter(r -> r.getReopenCount() != null && r.getReopenCount() > 0).count();
        int totalReopenCount = reclamations.stream().mapToInt(r -> r.getReopenCount() == null ? 0 : r.getReopenCount()).sum();

        int totalTimeSpentMinutes = reclamations.stream()
            .flatMap(r -> r.getSuivis().stream())
            .mapToInt(s -> s.getTimeSpentMinutes() == null ? 0 : s.getTimeSpentMinutes())
            .sum();
        double avgEffortMinutesPerReclamation = total > 0 ? (double) totalTimeSpentMinutes / total : 0.0;

        Map<StatutReclamation, Long> parStatut = new EnumMap<>(StatutReclamation.class);
        for (StatutReclamation statut : StatutReclamation.values()) {
            long count = reclamations.stream().filter(r -> r.getStatut() == statut).count();
            parStatut.put(statut, count);
        }

        Map<String, Long> parPriorite = new LinkedHashMap<>();
        parPriorite.put("CRITIQUE", reclamations.stream().filter(r -> r.getPriorite() != null && r.getPriorite().name().equals("CRITIQUE")).count());
        parPriorite.put("HAUTE", reclamations.stream().filter(r -> r.getPriorite() != null && r.getPriorite().name().equals("HAUTE")).count());
        parPriorite.put("MOYENNE", reclamations.stream().filter(r -> r.getPriorite() != null && r.getPriorite().name().equals("MOYENNE")).count());
        parPriorite.put("BASSE", reclamations.stream().filter(r -> r.getPriorite() != null && r.getPriorite().name().equals("BASSE")).count());

        Map<String, Long> parCause = new LinkedHashMap<>();
        for (RootCauseReclamation cause : RootCauseReclamation.values()) {
            parCause.put(cause.name(), reclamations.stream().filter(r -> r.getRootCause() == cause).count());
        }
        parCause.put("NON_RENSEIGNE", reclamations.stream().filter(r -> r.getRootCause() == null).count());

        List<Map<String, Object>> statusRows = new ArrayList<>();
        for (StatutReclamation statut : StatutReclamation.values()) {
            statusRows.add(Map.of("label", statut.name(), "count", parStatut.getOrDefault(statut, 0L)));
        }

        List<Map<String, Object>> priorityRows = new ArrayList<>();
        for (Map.Entry<String, Long> entry : parPriorite.entrySet()) {
            priorityRows.add(Map.of("label", entry.getKey(), "count", entry.getValue()));
        }

        List<Map<String, Object>> causeRows = new ArrayList<>();
        for (Map.Entry<String, Long> entry : parCause.entrySet()) {
            causeRows.add(Map.of("label", entry.getKey(), "count", entry.getValue()));
        }

        Map<String, Object> rapport = new LinkedHashMap<>();
        rapport.put("totalReclamations", total);
        rapport.put("reclamationsNotees", totalNotees);
        rapport.put("noteMoyenne", moyenne);
        rapport.put("openReclamations", openCount);
        rapport.put("resolvedReclamations", resolvedCount);
        rapport.put("closedReclamations", closedCount);
        rapport.put("criticalOpen", criticalOpen);
        rapport.put("overdueOpen", overdueOpen);
        rapport.put("slaComplianceRate", slaComplianceRate);
        rapport.put("reopenedTickets", reopenedTickets);
        rapport.put("totalReopenCount", totalReopenCount);
        rapport.put("totalTimeSpentMinutes", totalTimeSpentMinutes);
        rapport.put("avgEffortMinutesPerReclamation", avgEffortMinutesPerReclamation);
        rapport.put("repartitionParStatut", parStatut);
        rapport.put("repartitionParPriorite", parPriorite);
        rapport.put("repartitionParCause", parCause);
        rapport.put("statusRows", statusRows);
        rapport.put("priorityRows", priorityRows);
        rapport.put("causeRows", causeRows);
        rapport.put("dateDebut", fromDate == null ? "" : fromDate.toString());
        rapport.put("dateFin", toDate == null ? "" : toDate.toString());

        return rapport;
    }

    @Transactional(readOnly = true)
    public byte[] generateRapportCsv(LocalDate fromDate, LocalDate toDate) {
        Map<String, Object> rapport = getRapportSatisfaction(fromDate, toDate);

        @SuppressWarnings("unchecked")
        Map<StatutReclamation, Long> repartitionParStatut = (Map<StatutReclamation, Long>) rapport.get("repartitionParStatut");

        StringBuilder csv = new StringBuilder();
        csv.append("metrique,valeur\n");
        csv.append("totalReclamations,").append(rapport.get("totalReclamations")).append("\n");
        csv.append("reclamationsNotees,").append(rapport.get("reclamationsNotees")).append("\n");
        csv.append("noteMoyenne,").append(rapport.get("noteMoyenne")).append("\n");
        csv.append("dateDebut,").append(rapport.get("dateDebut")).append("\n");
        csv.append("dateFin,").append(rapport.get("dateFin")).append("\n");
        csv.append("overdueOpen,").append(rapport.get("overdueOpen")).append("\n");
        csv.append("slaComplianceRate,").append(rapport.get("slaComplianceRate")).append("\n");
        csv.append("reopenedTickets,").append(rapport.get("reopenedTickets")).append("\n");
        csv.append("totalReopenCount,").append(rapport.get("totalReopenCount")).append("\n");
        csv.append("totalTimeSpentMinutes,").append(rapport.get("totalTimeSpentMinutes")).append("\n");
        csv.append("avgEffortMinutesPerReclamation,").append(rapport.get("avgEffortMinutesPerReclamation")).append("\n");

        for (StatutReclamation statut : StatutReclamation.values()) {
            csv.append("statut_")
                    .append(statut.name())
                    .append(",")
                    .append(repartitionParStatut.getOrDefault(statut, 0L))
                    .append("\n");
        }

        @SuppressWarnings("unchecked")
        Map<String, Long> repartitionParCause = (Map<String, Long>) rapport.get("repartitionParCause");
        for (Map.Entry<String, Long> entry : repartitionParCause.entrySet()) {
            csv.append("cause_")
                .append(entry.getKey())
                .append(",")
                .append(entry.getValue())
                .append("\n");
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional(readOnly = true)
    public byte[] generateRapportJson(LocalDate fromDate, LocalDate toDate) {
        Map<String, Object> rapport = getRapportSatisfaction(fromDate, toDate);

        @SuppressWarnings("unchecked")
        Map<StatutReclamation, Long> repartitionParStatut = (Map<StatutReclamation, Long>) rapport.get("repartitionParStatut");

        StringBuilder json = new StringBuilder();
        json.append("{\n");
        json.append("  \"totalReclamations\": ").append(rapport.get("totalReclamations")).append(",\n");
        json.append("  \"reclamationsNotees\": ").append(rapport.get("reclamationsNotees")).append(",\n");
        json.append("  \"noteMoyenne\": ").append(rapport.get("noteMoyenne")).append(",\n");
        json.append("  \"dateDebut\": \"").append(rapport.get("dateDebut")).append("\",\n");
        json.append("  \"dateFin\": \"").append(rapport.get("dateFin")).append("\",\n");
        json.append("  \"overdueOpen\": ").append(rapport.get("overdueOpen")).append(",\n");
        json.append("  \"slaComplianceRate\": ").append(rapport.get("slaComplianceRate")).append(",\n");
        json.append("  \"reopenedTickets\": ").append(rapport.get("reopenedTickets")).append(",\n");
        json.append("  \"totalReopenCount\": ").append(rapport.get("totalReopenCount")).append(",\n");
        json.append("  \"totalTimeSpentMinutes\": ").append(rapport.get("totalTimeSpentMinutes")).append(",\n");
        json.append("  \"avgEffortMinutesPerReclamation\": ").append(rapport.get("avgEffortMinutesPerReclamation")).append(",\n");
        json.append("  \"repartitionParStatut\": {\n");

        StatutReclamation[] statuts = StatutReclamation.values();
        for (int i = 0; i < statuts.length; i++) {
            StatutReclamation statut = statuts[i];
            json.append("    \"")
                    .append(statut.name())
                    .append("\": ")
                    .append(repartitionParStatut.getOrDefault(statut, 0L));

            if (i < statuts.length - 1) {
                json.append(",");
            }
            json.append("\n");
        }

        json.append("  },\n");

        @SuppressWarnings("unchecked")
        Map<String, Long> repartitionParCause = (Map<String, Long>) rapport.get("repartitionParCause");
        json.append("  \"repartitionParCause\": {\n");
        int causeIndex = 0;
        for (Map.Entry<String, Long> entry : repartitionParCause.entrySet()) {
            json.append("    \"")
                    .append(entry.getKey())
                    .append("\": ")
                    .append(entry.getValue());
            if (causeIndex < repartitionParCause.size() - 1) {
                json.append(",");
            }
            json.append("\n");
            causeIndex++;
        }

        json.append("  }\n");
        json.append("}\n");

        return json.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Transactional(readOnly = true)
    public byte[] generateRapportPdf(LocalDate fromDate, LocalDate toDate) {
        Map<String, Object> rapport = getRapportSatisfaction(fromDate, toDate);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> statusRows = (List<Map<String, Object>>) rapport.get("statusRows");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> priorityRows = (List<Map<String, Object>>) rapport.get("priorityRows");

        try (PDDocument document = new PDDocument(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                drawPdfTitle(contentStream, rapport);
                drawSummaryTable(contentStream, rapport);
                drawCompactTable(contentStream, 500, "Repartition par statut", new String[] {"Statut", "Total"}, statusRows);
                drawCompactTable(contentStream, 340, "Repartition par priorite", new String[] {"Priorite", "Total"}, priorityRows);
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> causeRows = (List<Map<String, Object>>) rapport.get("causeRows");
                drawCompactTable(contentStream, 180, "Repartition par cause", new String[] {"Cause", "Total"}, causeRows);

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 9);
                contentStream.newLineAtOffset(50, 80);
                contentStream.showText("PDF genere le " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
                contentStream.endText();
            }

            document.save(outputStream);
            return outputStream.toByteArray();
        } catch (IOException ex) {
            throw new IllegalStateException("Impossible de generer le rapport PDF", ex);
        }
    }

    public String buildRapportFilename(String extension) {
        return "rapport-reclamations-" + REPORT_FILE_DATE_FORMAT.format(LocalDateTime.now()) + "." + extension;
    }

    private List<Reclamation> findReclamationsForReport(LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null && toDate != null) {
            return reclamationRepository.findByDateCreationBetween(fromDate.atStartOfDay(), toDate.atTime(23, 59, 59));
        }

        if (fromDate != null) {
            return reclamationRepository.findByDateCreationGreaterThanEqual(fromDate.atStartOfDay());
        }

        if (toDate != null) {
            return reclamationRepository.findByDateCreationLessThanEqual(toDate.atTime(23, 59, 59));
        }

        return reclamationRepository.findAll();
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("La date de debut doit etre inferieure ou egale a la date de fin");
        }
    }

    private void drawPdfTitle(PDPageContentStream contentStream, Map<String, Object> rapport) throws IOException {
        contentStream.beginText();
        contentStream.setLeading(16f);
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
        contentStream.newLineAtOffset(50, 790);
        contentStream.showText("Rapport de satisfaction - Reclamations");
        contentStream.newLine();
        contentStream.setFont(PDType1Font.HELVETICA, 10);
        contentStream.showText("Periode: " + (rapport.get("dateDebut").toString().isBlank() ? "Toutes les dates" : rapport.get("dateDebut") + " -> " + rapport.get("dateFin")));
        contentStream.endText();
    }

    private void drawSummaryTable(PDPageContentStream contentStream, Map<String, Object> rapport) throws IOException {
        float x = 50;
        float y = 740;
        float rowHeight = 20;
        float[] colWidths = {240, 200};

        drawTableHeader(contentStream, x, y, rowHeight, colWidths, new String[] {"Indicateur", "Valeur"});
        y -= rowHeight;

        String[][] rows = {
                {"Total reclamations", String.valueOf(rapport.get("totalReclamations"))},
                {"Reclamations notees", String.valueOf(rapport.get("reclamationsNotees"))},
                {"Note moyenne", String.valueOf(rapport.get("noteMoyenne"))},
                {"Ouvertes / En cours", String.valueOf(rapport.get("openReclamations"))},
                {"Resolues", String.valueOf(rapport.get("resolvedReclamations"))},
                {"Fermees", String.valueOf(rapport.get("closedReclamations"))},
                {"Critiques ouvertes", String.valueOf(rapport.get("criticalOpen"))},
                {"Ouvertes hors SLA", String.valueOf(rapport.get("overdueOpen"))},
                {"Conformite SLA (%)", String.valueOf(rapport.get("slaComplianceRate"))},
                {"Tickets reouverts", String.valueOf(rapport.get("reopenedTickets"))},
                {"Effort total (min)", String.valueOf(rapport.get("totalTimeSpentMinutes"))}
        };

        for (String[] row : rows) {
            drawTableRow(contentStream, x, y, rowHeight, colWidths, row);
            y -= rowHeight;
        }
    }

    private void drawCompactTable(
            PDPageContentStream contentStream,
            float startY,
            String title,
            String[] headers,
            List<Map<String, Object>> rows
    ) throws IOException {
        float x = 320;
        float y = startY;
        float rowHeight = 18;
        float[] colWidths = {120, 60};

        contentStream.beginText();
        contentStream.setFont(PDType1Font.HELVETICA_BOLD, 11);
        contentStream.newLineAtOffset(x, y + 20);
        contentStream.showText(title);
        contentStream.endText();

        drawTableHeader(contentStream, x, y, rowHeight, colWidths, headers);
        y -= rowHeight;

        for (Map<String, Object> row : rows) {
            drawTableRow(contentStream, x, y, rowHeight, colWidths, new String[] {
                    String.valueOf(row.get("label")),
                    String.valueOf(row.get("count"))
            });
            y -= rowHeight;
        }
    }

    private void drawTableHeader(
            PDPageContentStream contentStream,
            float x,
            float y,
            float rowHeight,
            float[] colWidths,
            String[] headers
    ) throws IOException {
        float currentX = x;
        for (int i = 0; i < headers.length; i++) {
            contentStream.addRect(currentX, y, colWidths[i], rowHeight);
            contentStream.stroke();
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
            contentStream.newLineAtOffset(currentX + 6, y + 6);
            contentStream.showText(headers[i]);
            contentStream.endText();
            currentX += colWidths[i];
        }
    }

    private void drawTableRow(
            PDPageContentStream contentStream,
            float x,
            float y,
            float rowHeight,
            float[] colWidths,
            String[] values
    ) throws IOException {
        float currentX = x;
        for (int i = 0; i < values.length; i++) {
            contentStream.addRect(currentX, y, colWidths[i], rowHeight);
            contentStream.stroke();
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA, 9);
            contentStream.newLineAtOffset(currentX + 6, y + 5);
            contentStream.showText(values[i]);
            contentStream.endText();
            currentX += colWidths[i];
        }
    }

    private Reclamation findReclamationById(Long id) {
        return reclamationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reclamation introuvable avec l'id : " + id));
    }

        private SuiviReclamation createSuivi(
            Reclamation reclamation,
            AgentSAV agentAuteur,
            ActionSuivi action,
            String message,
            StatutReclamation statutAvant,
            StatutReclamation statutApres,
            Integer timeSpentMinutes
        ) {
        SuiviReclamation suivi = SuiviReclamation.builder()
                .reclamation(reclamation)
                .agentAuteur(agentAuteur)
                .action(action)
                .message(message)
            .statutAvant(statutAvant)
            .statutApres(statutApres)
                .timeSpentMinutes(timeSpentMinutes)
                .build();

        return suiviReclamationRepository.save(suivi);
    }

    private ActionSuivi mapStatutToAction(StatutReclamation statut) {
        return switch (statut) {
            case OUVERTE, EN_COURS -> ActionSuivi.UPDATED;
            case RESOLUE -> ActionSuivi.RESOLVED;
            case FERMEE -> ActionSuivi.CLOSED;
        };
    }
}
