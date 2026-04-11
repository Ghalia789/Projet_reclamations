# System Architecture Overview

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP/HTTPS (CORS enabled)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼─────────┐
│                │  │                │  │                 │
│    Frontend    │  │   API Gateway  │  │  Static Assets  │
│   (Angular)    │  │ (Spring Boot)  │  │    (nginx)      │
│   Port 4200    │  │   Port 8080    │  │   Port 80       │
│                │  │                │  │                 │
└────────────────┘  └────────┬───────┘  └─────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼──────┐      ┌─────▼──────┐      ┌────▼──────┐
    │  Spring   │      │  Hibernate │      │  Swagger  │
    │  Security │      │    / JPA   │      │    / OAS  │
    │           │      │            │      │           │
    └──────┬────┘      └─────┬──────┘      └───────────┘
           │                 │
           └─────────────────┼─────────────────┐
                             │                 │
                        ┌────▼────────┐        │
                        │   MySQL     │        │
                        │  Database   │        │
                        │  Port 3306  │        │
                        │             │        │
                        └─────────────┘        │
                                        (API Docs only)
```

## 🔄 Request Flow

```
1. User interacts with Angular Frontend
   ↓
2. Frontend service calls REST API endpoint
   ↓
3. Spring Controller receives HTTP request
   ↓
4. DTO Validation (@Valid, @NotBlank, etc.)
   ↓
5. Service layer processes business logic
   ↓
6. Repository queries/updates database via JPA/Hibernate
   ↓
7. Exception handling (GlobalExceptionHandler)
   ↓
8. Response DTO serialized to JSON
   ↓
9. Frontend receives and renders data
```

## 🗄️ Data Flow

```
CRUD Operations:
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   Client    │────▶│  Repository  │────▶│   Database   │
│   Request   │     │  (JpaRepo)   │     │   (MySQL)    │
└─────────────┘     └──────────────┘     └──────────────┘

Response Path:
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│   Database   │────▶│   Mapper     │────▶│  Response   │
│   Entity     │     │ (Entity→DTO) │     │   DTO       │
└──────────────┘     └──────────────┘     └─────────────┘
                                                 │
                                                 ▼
                                          JSON → Frontend
```

## 🌳 Package Hierarchy (Backend)

```
com.project.reclamations
│
├── 📦 entity/                   JPA Entities
│   ├── Client.java
│   ├── Produit.java
│   ├── AgentSAV.java
│   ├── Reclamation.java
│   └── SuiviReclamation.java
│
├── 📦 enums/                    Enumerations
│   ├── StatutReclamation.java
│   └── ActionSuivi.java
│
├── 📦 repository/               JPA Repositories
│   ├── ClientRepository.java
│   ├── ProduitRepository.java
│   ├── AgentSAVRepository.java
│   ├── ReclamationRepository.java
│   └── SuiviReclamationRepository.java
│
├── 📦 dto/                      Data Transfer Objects
│   ├── request/
│   │   ├── ClientRequestDTO.java
│   │   ├── ReclamationRequestDTO.java
│   │   └── ...
│   └── response/
│       ├── ClientResponseDTO.java
│       ├── ReclamationResponseDTO.java
│       └── ...
│
├── 📦 mapper/                   Entity ↔ DTO Mappers
│   ├── ClientMapper.java
│   ├── ReclamationMapper.java
│   └── ...
│
├── 📦 service/                  Business Logic
│   ├── ClientService.java
│   ├── ReclamationService.java
│   ├── ReportService.java
│   └── ...
│
├── 📦 controller/               REST Endpoints
│   ├── ClientController.java
│   ├── ReclamationController.java
│   └── ...
│
├── 📦 exception/                Error Handling
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java
│
├── 📦 security/                 Authentication & Authorization
│   └── SecurityConfig.java
│
└── ReclamationsApplication.java  Entry Point
```

## 🎯 Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Angular Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Components   │  │   Services   │  │   Guards &   │  │
│  │ (Pages)      │→ │ (API calls)  │→ │ Interceptors │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└────────────────────────────┬───────────────────────────┘
                             │
                    REST API (JSON)
                             │
┌────────────────────────────▼───────────────────────────┐
│              Spring Boot Backend                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Controller   │→ │   Service    │→ │ Repository   │ │
│  │ (Endpoints)  │  │ (Business)   │  │(Data Access) │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│         ▲                                       │       │
│         │           DTO Validation             │       │
│         │         (@Valid Annotations)         ▼       │
│         └─────────────────────────────────────▶       │
│                                                       │
│  ┌──────────────────────────────────────────────────┐│
│  │  Global Exception Handler (@ControllerAdvice)   ││
│  └──────────────────────────────────────────────────┘│
└────────────────────────────┬───────────────────────────┘
                             │
                        JDBC/SQL
                             │
┌────────────────────────────▼───────────────────────────┐
│              MySQL Database (port 3306)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Clients    │  │  Reclamations│  │   Produits   │ │
│  │   (Table)    │  │   (Table)    │  │   (Table)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│  ┌──────────────┐  ┌──────────────┐                   │
│  │  AgentSAV    │  │SuiviReclamation               │ │
│  │   (Table)    │  │   (Table)                       │ │
│  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────┘
```

## 📡 API Layer (12 Endpoints)

```
┌──────────────────────────────────────────────────────────┐
│                   REST API Endpoints                      │
├──────────────────────────────────────────────────────────┤
│ Clients:                                                  │
│   GET    /api/clients              → List all            │
│   POST   /api/clients              → Create new          │
├──────────────────────────────────────────────────────────┤
│ Reclamations (Core):                                      │
│   GET    /api/reclamations         → List all            │
│   POST   /api/reclamations         → Create new          │
│   PUT    /api/reclamations/{id}/assign   → Assign agent  │
│   PUT    /api/reclamations/{id}/statut   → Update status │
│   GET    /api/reclamations/{id}/suivi    → Get history   │
│   POST   /api/reclamations/{id}/suivi    → Add entry     │
│   GET    /api/reclamations/rapport       → Report        │
├──────────────────────────────────────────────────────────┤
│ Masters:                                                  │
│   GET    /api/agents               → List all SAV        │
│   GET    /api/produits             → List all products   │
└──────────────────────────────────────────────────────────┘
```

## 🐳 Docker Container Architecture

```
┌────────────────────────────────────────────────────────┐
│          docker-compose.yml Orchestration               │
├────────────────────────────────────────────────────────┤
│                                                         │
│  ┌────────────────┐   ┌────────────────┐               │
│  │  MySQL 8.0     │   │  Spring Boot   │               │
│  │  Port: 3306    │   │  Port: 8080    │               │
│  │  Volume: /db   │◄──┤  depends_on: db              │
│  │                │   │                │               │
│  └────────────────┘   └────────────────┘               │
│                                                         │
│  ┌────────────────┐                                    │
│  │  Nginx/Angular │                                    │
│  │  Port: 80/4200 │  (Optional - can run separate)    │
│  │                │                                    │
│  └────────────────┘                                    │
│                                                         │
│  Network: bridge (internal communication)             │
│                                                         │
└────────────────────────────────────────────────────────┘
```

## 🔐 Security Architecture

```
                    HTTP Request
                         │
                         ▼
        ┌────────────────────────────────┐
        │  AuthInterceptor (Angular)     │
        │  - Inject JWT Token            │
        │  - Add Authorization header    │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  Spring Security Filter        │
        │  - Validate JWT Token          │
        │  - Extract User Principal      │
        └────────────────┬───────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │  @PreAuthorize Annotation      │
        │  - Check role/permission       │
        │  - Allow/Deny access           │
        └────────────────┬───────────────┘
                         │
                    ✅ Access Granted
                    ❌ 401/403 Response
```

---

## 📊 Database Schema Relationships

```
                    ┌──────────────┐
                    │    Client    │
                    │  (id: PK)    │
                    │  nom         │
                    │  email       │
                    │  telephone   │
                    └──────┬───────┘
                           │ 1
                           │
                        1――N
                           │
                           ▼
                ┌───────────────────────────┐
                │    Reclamation            │
                │  (id: PK)                 │
                │  description              │
                │  date                     │
                │  statut (ENUM)            │
                │  note (1-5)               │
                │  client_id (FK) ──────────┐
                │  agent_id (FK) ───────────┼──┐
                │  produit_id (FK) ─────────┼──┼──┐
                └────────┬────────────────┬─┘  │  │
                         │ 1              N  │  │  │
                         │              1──┘  │  │  │
                      1――N                    │  │  │
                         │                    │  │  │
                         ▼                    │  │  │
             ┌────────────────────┐           │  │  │
             │ SuiviReclamation   │           │  │  │
             │ (id: PK)           │           │  │  │
             │ message            │           │  │  │
             │ action (ENUM)      │           │  │  │
             │ date               │           │  │  │
             │ reclamation_id─────┘           │  │  │
             │ agent_id ──────────────────────┘  │  │
             └────────────────────┘              │  │
                                                 │  │
                                    ┌────────────┘  │
                                    │               │
                                    ▼               │
                          ┌──────────────────┐      │
                          │   AgentSAV       │      │
                          │  (id: PK)        │      │
                          │  nom             │      │
                          │  competence      │      │
                          └──────────────────┘      │
                                                    │
                                        ┌───────────┘
                                        │
                                        ▼
                                ┌──────────────┐
                                │   Produit    │
                                │  (id: PK)    │
                                │  nom         │
                                │  categorie   │
                                └──────────────┘
```

---

**Architecture Documentation: April 11, 2026**
