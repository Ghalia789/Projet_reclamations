import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenService } from './token.service';

export type ReclamationStatut = 'OUVERTE' | 'EN_COURS' | 'RESOLUE' | 'FERMEE';
export type ReclamationAction = 'CREATED' | 'ASSIGNED' | 'UPDATED' | 'RESOLVED' | 'CLOSED';
export type ReclamationPriorite = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';
export type ReclamationCanal = 'WEB' | 'EMAIL' | 'TELEPHONE' | 'AGENCE';
export type ReclamationRootCause =
  | 'QUALITE_PRODUIT'
  | 'DEFAUT_LIVRAISON'
  | 'RETARD_LIVRAISON'
  | 'FACTURATION'
  | 'MAUVAISE_UTILISATION'
  | 'AUTRE';

export interface Reclamation {
  id: number;
  numeroTicket: string;
  description: string;
  dateCreation: string;
  dateResolution: string | null;
  statut: ReclamationStatut;
  priorite: ReclamationPriorite;
  canalOrigine: ReclamationCanal;
  slaDueAt: string | null;
  rootCause: ReclamationRootCause | null;
  reopenCount: number;
  note: number | null;
  clientId: number;
  produitId: number;
  agentAssigneId: number | null;
}

export interface ReclamationCreatePayload {
  description: string;
  note?: number;
  clientId: number;
  produitId: number;
  agentAssigneId?: number;
  priorite?: ReclamationPriorite;
  canalOrigine?: ReclamationCanal;
  slaDueAt?: string;
  rootCause?: ReclamationRootCause;
}

export interface ReclamationAssignPayload {
  agentId: number;
}

export interface ReclamationUpdateStatutPayload {
  statut: ReclamationStatut;
  message?: string;
  timeSpentMinutes?: number;
}

export interface SuiviReclamation {
  id: number;
  message: string;
  action: ReclamationAction;
  dateAction: string;
  timeSpentMinutes: number | null;
  reclamationId: number;
  agentAuteurId: number | null;
}

export interface RapportSatisfaction {
  totalReclamations: number;
  reclamationsNotees: number;
  noteMoyenne: number;
  repartitionParStatut: Record<ReclamationStatut, number>;
  repartitionParPriorite: Record<ReclamationPriorite, number>;
  openReclamations: number;
  resolvedReclamations: number;
  closedReclamations: number;
  criticalOpen: number;
  overdueOpen: number;
  slaComplianceRate: number;
  reopenedTickets: number;
  totalReopenCount: number;
  totalTimeSpentMinutes: number;
  avgEffortMinutesPerReclamation: number;
  repartitionParCause: Record<string, number>;
  dateDebut?: string;
  dateFin?: string;
}

@Injectable({ providedIn: 'root' })
export class ReclamationService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/reclamations`;

  constructor(
    private readonly http: HttpClient,
    private readonly tokenService: TokenService
  ) {}

  getAll(): Observable<Reclamation[]> {
    return this.http.get<Reclamation[]>(this.baseUrl, { headers: this.buildAuthHeaders() });
  }

  getById(id: number): Observable<Reclamation> {
    return this.http.get<Reclamation>(`${this.baseUrl}/${id}`, { headers: this.buildAuthHeaders() });
  }

  create(payload: ReclamationCreatePayload): Observable<Reclamation> {
    return this.http.post<Reclamation>(this.baseUrl, payload, { headers: this.buildAuthHeaders() });
  }

  assignAgent(id: number, payload: ReclamationAssignPayload): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/assign`, payload, { headers: this.buildAuthHeaders() });
  }

  updateStatut(id: number, payload: ReclamationUpdateStatutPayload): Observable<Reclamation> {
    return this.http.put<Reclamation>(`${this.baseUrl}/${id}/statut`, payload, { headers: this.buildAuthHeaders() });
  }

  getSuiviByReclamation(id: number): Observable<SuiviReclamation[]> {
    return this.http.get<SuiviReclamation[]>(`${this.baseUrl}/${id}/suivi`, { headers: this.buildAuthHeaders() });
  }

  getRapport(fromDate?: string, toDate?: string): Observable<RapportSatisfaction> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get<RapportSatisfaction>(`${this.baseUrl}/rapport`, {
      headers: this.buildAuthHeaders(),
      params
    });
  }

  downloadRapport(
    format: 'csv' | 'json' | 'pdf',
    fromDate?: string,
    toDate?: string
  ): Observable<HttpResponse<Blob>> {
    let params = new HttpParams().set('format', format);
    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }
    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get(`${this.baseUrl}/rapport/download`, {
      headers: this.buildAuthHeaders(),
      params,
      responseType: 'blob',
      observe: 'response'
    });
  }

  private buildAuthHeaders(): HttpHeaders | undefined {
    const token = this.tokenService.get();
    if (!token) {
      return undefined;
    }

    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }
}
