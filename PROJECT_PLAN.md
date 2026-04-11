# Projet 5: Système de Gestion des Réclamations - Project Plan

## 📋 Executive Summary
Full-stack complaint management system with Spring Boot 4 backend (REST API) and Angular frontend (SPA), complete with Docker containerization, Swagger documentation, and Spring Security.

---

## 🏗️ Phase 1: Backend Setup (Spring Boot 4)

### 1.1 Project Initialization
- [ ] Create Maven project structure with Spring Boot 4 starter
- [ ] Configure `pom.xml` with dependencies:
  - Spring Boot Starter Web
  - Spring Boot Starter Data JPA
  - Spring Boot Starter Security
  - MySQL Driver
  - Lombok
  - Spring Doc OpenAPI (Swagger)
  - Validation API

### 1.2 Database Configuration
- [ ] Configure `application.properties` (MySQL connection)
- [ ] Set up JPA/Hibernate DDL mode
- [ ] Create database schema (if manual)

### 1.3 Domain Layer - JPA Entities
- [ ] Create enums: `StatutReclamation`, `ActionSuivi`
- [ ] Entity: `Client` (@Data, @Table, validations)
- [ ] Entity: `Produit`
- [ ] Entity: `AgentSAV`
- [ ] Entity: `Reclamation` (with all FKs, relationships)
- [ ] Entity: `SuiviReclamation` (audit trail)
- [ ] Configure Entity relationships (`@OneToMany`, `@ManyToOne`, cascading)

### 1.4 Repository Layer
- [ ] `ClientRepository extends JpaRepository`
- [ ] `ProduitRepository extends JpaRepository`
- [ ] `AgentSAVRepository extends JpaRepository`
- [ ] `ReclamationRepository extends JpaRepository` (with custom queries)
- [ ] `SuiviReclamationRepository extends JpaRepository`

### 1.5 DTO Layer
**Request DTOs** (with @Valid, @NotBlank, @Email, etc.):
- [ ] `ClientRequestDTO`
- [ ] `ProduitRequestDTO`
- [ ] `AgentSAVRequestDTO`
- [ ] `ReclamationRequestDTO`
- [ ] `SuiviReclamationRequestDTO`

**Response DTOs** (for API responses):
- [ ] `ClientResponseDTO`
- [ ] `ProduitResponseDTO`
- [ ] `AgentSAVResponseDTO`
- [ ] `ReclamationResponseDTO`
- [ ] `SuiviReclamationResponseDTO`

### 1.6 Mapper Layer
- [ ] `ClientMapper` (entity ↔ DTO)
- [ ] `ProduitMapper`
- [ ] `AgentSAVMapper`
- [ ] `ReclamationMapper`
- [ ] `SuiviReclamationMapper`

### 1.7 Exception Handling
- [ ] Create `ResourceNotFoundException`
- [ ] Create `GlobalExceptionHandler` (@ControllerAdvice)
- [ ] Implement structured error responses

### 1.8 Service Layer
- [ ] `ClientService` (CRUD operations)
- [ ] `ProduitService`
- [ ] `AgentSAVService`
- [ ] `ReclamationService` (complex logic: assign, status update, auto-create SuiviReclamation)
- [ ] `SuiviReclamationService`
- [ ] `ReportService` (satisfaction report)

### 1.9 Controller Layer
- [ ] `ClientController` (GET all, POST create)
- [ ] `ProduitController` (GET all)
- [ ] `AgentSAVController` (GET all)
- [ ] `ReclamationController` (GET, POST, PUT assign, PUT status, GET suivi, POST suivi)
- [ ] Add Swagger annotations (@Operation, @Tag, @ApiResponse)

### 1.10 Security Configuration
- [ ] `SecurityConfig` (Spring Security configuration)
- [ ] JWT setup (optional but recommended)
- [ ] `@PreAuthorize` annotations on endpoints

### 1.11 Swagger/OpenAPI Configuration
- [ ] Configure springdoc-openapi
- [ ] Swagger UI endpoint (`/swagger-ui.html`)
- [ ] Generate OpenAPI JSON (`/v3/api-docs`)

---

## 🎨 Phase 2: Frontend Setup (Angular)

### 2.1 Angular Project Initialization
- [ ] Generate Angular project with Angular CLI
- [ ] Configure Angular with TypeScript strict mode

### 2.2 Module Structure
- [ ] Create `ReclamationsModule`
- [ ] Create shared module for common components

### 2.3 Services
- [ ] `ReclamationService` (HTTP calls, state management)
- [ ] `ClientService`
- [ ] `AgentService`
- [ ] `ProduitService`
- [ ] `AuthService` (JWT token handling)

### 2.4 Guards & Interceptors
- [ ] `AuthGuard` (protect routes)
- [ ] `AuthInterceptor` (inject JWT token on every request)

### 2.5 Components & Pages
- [ ] `complaints-list` (display all complaints, filter, search)
- [ ] `complaint-detail` (view single complaint, history/suivi)
- [ ] `new-complaint` (create complaint form with validation)
- [ ] `agents` (list all SAV agents)
- [ ] `products` (list all products)
- [ ] `dashboard/report` (satisfaction report with charts)
- [ ] `complaint-assign` (assign agent to complaint)
- [ ] `complaint-status-update` (change complaint status)

### 2.6 Routing
- [ ] Configure `app-routing.module.ts`
- [ ] Lazy loading for modules
- [ ] Route guards on protected pages

### 2.7 UI/UX
- [ ] Bootstrap or Angular Material integration
- [ ] Responsive design
- [ ] Form validation (client-side)
- [ ] Loading & error state handling

---

## 🐳 Phase 3: Docker & Containerization

### 3.1 Backend Dockerfile
- [ ] Multi-stage Dockerfile for Spring Boot app
- [ ] Build stage (Maven build)
- [ ] Run stage (JRE with compiled app)
- [ ] Expose port 8080

### 3.2 docker-compose.yml
- [ ] MySQL service (port 3306, volume mount)
- [ ] Spring Boot service (port 8080, depends_on db)
- [ ] Angular service (nginx, port 80, optional)
- [ ] Environment variables (DB_URL, DB_USER, DB_PASSWORD)

### 3.3 .dockerignore files
- [ ] Backend `.dockerignore`
- [ ] Frontend `.dockerignore`

---

## 📚 Phase 4: Documentation

### 4.1 README.md (Root)
- [ ] Project overview
- [ ] Tech stack summary
- [ ] How to run locally (`docker-compose up`)
- [ ] How to run tests

### 4.2 Backend README
- [ ] API endpoints documentation (auto-generated via Swagger)
- [ ] Setup instructions
- [ ] Database schema diagram

### 4.3 Frontend README
- [ ] Components overview
- [ ] How to run dev server
- [ ] Build instructions

### 4.4 Swagger/OpenAPI Documentation
- [ ] Auto-generated via springdoc-openapi
- [ ] Accessible at `http://localhost:8080/swagger-ui.html`

---

## 🧪 Phase 5: Testing & Quality Assurance

### 5.1 Backend Unit Tests
- [ ] Service layer tests (JUnit + Mockito)
- [ ] Controller tests (MockMvc)
- [ ] Repository tests (Embedded MySQL or H2)

### 5.2 Integration Tests
- [ ] End-to-end API tests
- [ ] Docker integration tests

### 5.3 Frontend Unit Tests
- [ ] Jasmine/Karma tests for services
- [ ] Component tests
- [ ] Guard tests

### 5.4 Code Quality
- [ ] SonarQube analysis (optional)
- [ ] Code coverage reports

---

## 📝 Phase 6: Git & Version Control

### 6.1 Commit Strategy
- [ ] Feature branches for each phase
- [ ] Clean, descriptive commit messages
- [ ] Pull request reviews before merge

### 6.2 Commit Guidelines
```
feat: add client entity with validation
fix: correct email validation regex
docs: update API documentation
chore: configure docker-compose
test: add client service unit tests
```

---

## 🚀 Phase 7: Deployment (Bonus)

### 7.1 GCP Deployment
- [ ] Create GCP project
- [ ] Set up Cloud SQL (MySQL)
- [ ] Deploy Spring Boot to Cloud Run
- [ ] Deploy Angular to Cloud Storage/CDN
- [ ] Configure Cloud Load Balancer

### 7.2 CI/CD Pipeline
- [ ] GitHub Actions or Cloud Build
- [ ] Auto-build and deploy on push

---

## 📊 Grading Checklist

| Criterion | Details | Status |
|-----------|---------|--------|
| **Git Quality** | Clean commits, meaningful messages, regular frequency | ☐ |
| **Operationality** | `docker-compose up` works perfectly | ☐ |
| **Architecture** | Clean separation: REST API + Angular SPA | ☐ |
| **Validation** | Spring Validator on ALL API inputs | ☐ |
| **API Documentation** | Swagger/OpenAPI complete | ☐ |
| **Cloud Deployment** | GCP deployment (BONUS) | ☐ |

---

## 🎯 Milestone Dates

| Milestone | Target Date |
|-----------|------------|
| Backend Phase Complete | — |
| Frontend Phase Complete | — |
| Docker Setup & Testing | — |
| Documentation Complete | — |
| Final Testing & QA | — |
| Deployment Ready | — |

---

## 📌 Key Implementation Notes

1. **Auto-create SuiviReclamation**: Every status change or agent assignment must create an audit log entry
2. **Validation**: Use `@Valid` on ALL request DTOs; Spring Validator handles it automatically
3. **Error Handling**: Return 404 via `ResourceNotFoundException` when entity not found
4. **DTOs**: Separate request (with `@Valid`) from response DTOs
5. **Swagger**: Document all endpoints with `@Operation` and `@Tag`
6. **Security**: Use `@PreAuthorize` for role-based access control
7. **Testing**: Ensure operationality with `docker-compose up`

---

## 📂 Project Structure (Final)

```
Projet_reclamations/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/project/reclamations/
│   │   │   │   ├── entity/
│   │   │   │   ├── enums/
│   │   │   │   ├── repository/
│   │   │   │   ├── dto/
│   │   │   │   │   ├── request/
│   │   │   │   │   └── response/
│   │   │   │   ├── mapper/
│   │   │   │   ├── service/
│   │   │   │   ├── controller/
│   │   │   │   ├── exception/
│   │   │   │   ├── security/
│   │   │   │   └── ReclamationsApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql (seed data)
│   │   └── test/
│   ├── pom.xml
│   ├── Dockerfile
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/
│   │   │   │   └── reclamations/
│   │   │   │       ├── pages/
│   │   │   │       ├── services/
│   │   │   │       └── reclamations.module.ts
│   │   │   ├── shared/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── app-routing.module.ts
│   │   │   └── app.module.ts
│   │   └── assets/
│   ├── ng-build/
│   ├── Dockerfile
│   ├── package.json
│   └── README.md
├── docker-compose.yml
├── README.md
└── PROJECT_PLAN.md
```

---

Generated: April 11, 2026
