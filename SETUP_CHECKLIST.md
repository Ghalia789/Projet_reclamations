# 🎯 Project Setup Checklist - Système de Gestion des Réclamations

## ✅ Phase 1: Initial Setup

- [x] **Git Repository Initialized** - Set up version control
- [x] **Folder Structure Created** - `/backend` and `/frontend` folders
- [x] **Documentation Created**:
  - [x] README.md (root overview)
  - [x] PROJECT_PLAN.md (detailed roadmap)
  - [x] ARCHITECTURE.md (system design)
  - [x] SETUP_CHECKLIST.md (this file)

---

## 📋 Phase 2: Backend Development (Spring Boot 4)

### 2.1 Project Setup
- [ ] Initialize Maven project in `/backend`
- [ ] Create Spring Boot 4 starter with `spring-boot-starter-web`
- [ ] Configure `pom.xml`:
  ```xml
  <dependencies>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
    </dependency>
    <dependency>
      <groupId>org.projectlombok</groupId>
      <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springdoc</groupId>
      <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    </dependency>
    <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
      <groupId>jakarta.validation</groupId>
      <artifactId>jakarta.validation-api</artifactId>
    </dependency>
  </dependencies>
  ```

### 2.2 Database & Configuration
- [ ] Create `src/main/resources/application.properties`
- [ ] Configure MySQL connection:
  ```properties
  spring.datasource.url=jdbc:mysql://db:3306/reclamations_db
  spring.datasource.username=root
  spring.datasource.password=root
  spring.jpa.hibernate.ddl-auto=create-drop
  spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
  ```
- [ ] Create MySQL database schema

### 2.3 Entities (com/project/reclamations/entity/)
- [ ] Create `Statut` enum (`OUVERTE, EN_COURS, RESOLUE, FERMEE`)
- [ ] Create `ActionSuivi` enum (`CREATED, ASSIGNED, UPDATED, RESOLVED, CLOSED`)
- [ ] Create `Client` entity:
  ```java
  @Data @Builder
  @Entity @Table(name = "clients")
  public class Client {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank private String nom;
    @Email @NotBlank @Column(unique = true) private String email;
    @NotBlank private String telephone;
    @OneToMany(mappedBy = "client") private List<Reclamation> reclamations;
  }
  ```
- [ ] Create `Produit` entity
- [ ] Create `AgentSAV` entity
- [ ] Create `Reclamation` entity (with FKs to Client, Produit, AgentSAV)
- [ ] Create `SuiviReclamation` entity (audit trail)

### 2.4 Repositories (com/project/reclamations/repository/)
- [ ] `ClientRepository extends JpaRepository<Client, Long>`
- [ ] `ProduitRepository extends JpaRepository<Produit, Long>`
- [ ] `AgentSAVRepository extends JpaRepository<AgentSAV, Long>`
- [ ] `ReclamationRepository extends JpaRepository<Reclamation, Long>`
- [ ] `SuiviReclamationRepository extends JpaRepository<SuiviReclamation, Long>`

### 2.5 DTOs (com/project/reclamations/dto/)
**Request DTOs** (with validation):
- [ ] `ClientRequestDTO` (@NotBlank, @Email)
- [ ] `ProduitRequestDTO`
- [ ] `AgentSAVRequestDTO`
- [ ] `ReclamationRequestDTO` (@NotNull for FKs)
- [ ] `SuiviReclamationRequestDTO`

**Response DTOs**:
- [ ] `ClientResponseDTO`
- [ ] `ProduitResponseDTO`
- [ ] `AgentSAVResponseDTO`
- [ ] `ReclamationResponseDTO`
- [ ] `SuiviReclamationResponseDTO`

### 2.6 Mappers (com/project/reclamations/mapper/)
- [ ] `ClientMapper` (toEntity, toResponseDTO)
- [ ] `ProduitMapper`
- [ ] `AgentSAVMapper`
- [ ] `ReclamationMapper`
- [ ] `SuiviReclamationMapper`

### 2.7 Services (com/project/reclamations/service/)
- [ ] `ClientService` - CRUD operations
- [ ] `ProduitService` - List products
- [ ] `AgentSAVService` - List agents
- [ ] `ReclamationService` - Complex logic:
  - Get all complaints
  - Create complaint
  - Assign agent (auto-create SuiviReclamation)
  - Update status (auto-create SuiviReclamation)
  - Get complaint history
  - Add follow-up entry
- [ ] `SuiviReclamationService` - Audit trail operations
- [ ] `ReportService` - Satisfaction report generation

### 2.8 Controllers (com/project/reclamations/controller/)
- [ ] `ClientController` (GET /, POST /)
- [ ] `ProduitController` (GET /)
- [ ] `AgentSAVController` (GET /)
- [ ] `ReclamationController`:
  - GET /
  - POST /
  - PUT /{id}/assign
  - PUT /{id}/statut
  - GET /{id}/suivi
  - POST /{id}/suivi
  - GET /rapport
- [ ] Add Swagger annotations (@Operation, @Tag, @ApiResponse, @ApiModel)

### 2.9 Exception Handling (com/project/reclamations/exception/)
- [ ] Create `ResourceNotFoundException`
- [ ] Create `GlobalExceptionHandler` (@ControllerAdvice):
  - Handle ResourceNotFoundException → 404
  - Handle validation errors → 400
  - Handle generic exceptions → 500
  - Return structured error response

### 2.10 Security (com/project/reclamations/security/)
- [ ] Create `SecurityConfig` (Spring Security)
- [ ] Configure JWT (if needed)
- [ ] Create custom UserDetailsService (if needed)
- [ ] Add @PreAuthorize annotations to endpoints

### 2.11 Swagger Configuration
- [ ] Enable springdoc-openapi beans
- [ ] Configure API title, description, version
- [ ] Set API documentation URL
- [ ] Swagger UI accessible at `/swagger-ui.html`

### 2.12 Main Application Class
- [ ] Create `ReclamationsApplication.java`
- [ ] Add `@SpringBootApplication` annotation

---

## 🎨 Phase 3: Frontend Development (Angular)

### 3.1 Project Setup
- [ ] Initialize Angular project in `/frontend`
- [ ] Configure TypeScript strict mode
- [ ] Install dependencies: `npm install`

### 3.2 Project Structure
- [ ] Create app modules:
  - [ ] `AppModule`
  - [ ] `ReclamationsModule`
  - [ ] `SharedModule`

### 3.3 Services (src/app/services/)
- [ ] `ReclamationService` (API calls, state management)
- [ ] `ClientService`
- [ ] `AgentService`
- [ ] `ProduitService`
- [ ] `AuthService` (JWT token, login/logout)

### 3.4 Guards & Interceptors
- [ ] `AuthGuard` - Protect routes
- [ ] `AuthInterceptor` - Inject JWT token on every request

### 3.5 Components & Pages
- [ ] `complaints-list` component (list view, filters, search)
- [ ] `complaint-detail` component (view single complaint, history)
- [ ] `new-complaint` component (form with validation)
- [ ] `complaint-assign` component (assign agent)
- [ ] `complaint-status` component (update status)
- [ ] `agents` page (list SAV agents)
- [ ] `products` page (list products)
- [ ] `dashboard/report` page (satisfaction metrics, charts)

### 3.6 Routing
- [ ] Configure `AppRoutingModule`
- [ ] Lazy load `ReclamationsModule`
- [ ] Add route guards on protected pages
- [ ] Configure 404 not-found route

### 3.7 UI/UX
- [ ] Install Bootstrap or Angular Material
- [ ] Create reusable components (buttons, cards, modals)
- [ ] Responsive design (mobile-first)
- [ ] Form validation (reactive forms)
- [ ] Loading spinners & error messages

### 3.8 Environment Configuration
- [ ] Create `environment.ts` (dev)
- [ ] Create `environment.prod.ts` (production)
- [ ] Configure API base URL

---

## 🐳 Phase 4: Docker & Containerization

### 4.1 Backend Dockerfile
- [ ] Create `backend/Dockerfile`:
  ```dockerfile
  FROM maven:3.9-openjdk-21 as builder
  WORKDIR /app
  COPY pom.xml .
  RUN mvn dependency:go-offline
  COPY . .
  RUN mvn clean package

  FROM openjdk:21-jdk-slim
  COPY --from=builder /app/target/*.jar app.jar
  EXPOSE 8080
  CMD ["java", "-jar", "app.jar"]
  ```

### 4.2 Frontend Dockerfile
- [ ] Create `frontend/Dockerfile` (nginx)

### 4.3 Docker Compose
- [ ] Create `docker-compose.yml`:
  ```yaml
  version: '3.8'
  services:
    db:
      image: mysql:8.0
      ports:
        - "3306:3306"
      environment:
        MYSQL_ROOT_PASSWORD: root
        MYSQL_DATABASE: reclamations_db
      volumes:
        - db_data:/var/lib/mysql

    backend:
      build: ./backend
      container_name: reclamations-api
      ports:
        - "8080:8080"
      depends_on:
        - db
      environment:
        SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/reclamations_db
        SPRING_DATASOURCE_USERNAME: root
        SPRING_DATASOURCE_PASSWORD: root

    frontend:
      build: ./frontend
      container_name: reclamations-ui
      ports:
        - "80:80"
      depends_on:
        - backend

  volumes:
    db_data:
  ```

### 4.4 .dockerignore Files
- [ ] Create `backend/.dockerignore`
- [ ] Create `frontend/.dockerignore`

---

## 📚 Phase 5: Testing

### 5.1 Backend Tests
- [ ] Unit tests for services (JUnit + Mockito)
- [ ] Controller tests (MockMvc)
- [ ] Repository tests (H2 in-memory)
- [ ] Integration tests (TestContainers for MySQL)

### 5.2 Frontend Tests
- [ ] Service tests (Jasmine/Karma)
- [ ] Component tests
- [ ] Guard tests

### 5.3 Smoke Test
- [ ] `docker-compose up` → successful start
- [ ] API endpoints respond (GET /api/clients)
- [ ] Swagger UI accessible
- [ ] Frontend loads
- [ ] Database queries work

---

## 📝 Phase 6: Git & Documentation

### 6.1 Git Setup
- [ ] Initialize git repository: `git init`
- [ ] Create `.gitignore`:
  ```
  target/
  node_modules/
  dist/
  .env
  *.log
  .DS_Store
  ```
- [ ] Initial commit: `git commit -m "chore: initialize project"`

### 6.2 Commit Strategy
- [ ] Feature branch for each phase: `git checkout -b feat/backend-setup`
- [ ] Regular, meaningful commits:
  ```
  feat: add client entity with validation
  feat: create client repository layer
  feat: implement client service CRUD
  feat: add client REST endpoints
  docs: update API documentation
  ```
- [ ] Clean merge (no-ff) back to main

### 6.3 Documentation
- [ ] README.md ✅ (already created)
- [ ] PROJECT_PLAN.md ✅ (already created)
- [ ] ARCHITECTURE.md ✅ (already created)
- [ ] Backend README with API endpoints
- [ ] Frontend README with components
- [ ] Swagger API docs (auto-generated)

---

## ☁️ Phase 7: Cloud Deployment (BONUS)

### 7.1 GCP Setup
- [ ] Create GCP project
- [ ] Set up Cloud SQL (MySQL)
- [ ] Create service account & credentials

### 7.2 Backend Deployment
- [ ] Deploy to Google Cloud Run
- [ ] Configure environment variables
- [ ] Set up Cloud Build CI/CD

### 7.3 Frontend Deployment
- [ ] Deploy to Google Cloud Storage
- [ ] Set up Cloud CDN
- [ ] Configure CORS for API calls

---

## ✨ Final Quality Checklist

### Code Quality
- [ ] All code follows Java naming conventions
- [ ] DTOs properly separated (request/response)
- [ ] No hardcoded values (use application.properties)
- [ ] Error messages are descriptive
- [ ] No console logs (use logger)

### Validation
- [ ] @Valid on all request DTOs
- [ ] @NotBlank on name, email, description fields
- [ ] @Email on Client.email
- [ ] @Min/@Max on Reclamation.note
- [ ] @NotNull on FK references

### API Documentation
- [ ] All endpoints documented with @Operation
- [ ] Request/response examples in Swagger
- [ ] Error responses documented (400, 404, 500)

### Architecture
- [ ] Clean separation of concerns (entity/DTO/service/controller)
- [ ] No business logic in controllers
- [ ] Repositories only contain queries
- [ ] Services handle complex logic

### Testing
- [ ] Minimum 80% code coverage
- [ ] All happy paths tested
- [ ] Error cases tested
- [ ] Integration tests pass

### Operationality
- [ ] `docker-compose up` works without errors
- [ ] All 12 endpoints functional
- [ ] Database persists data correctly
- [ ] API responds with proper HTTP status codes

### Git Quality
- [ ] Meaningful commit messages
- [ ] Regular, frequent commits (not all at end)
- [ ] Clean commit history (no "fixes" commits)
- [ ] Feature branches for development

---

## 🚀 Quick Commands Reference

### Backend
```bash
# Create Spring Boot project
mvn archetype:generate -DgroupId=com.project -DartifactId=reclamations -DarchetypeArtifactId=maven-archetype-quickstart

# Build
cd backend
mvn clean package

# Run
mvn spring-boot:run

# Run tests
mvn test
```

### Frontend
```bash
# Create Angular project
ng new frontend

# Install dependencies
cd frontend
npm install

# Run dev server
ng serve

# Build for production
ng build --prod

# Run tests
ng test
```

### Docker
```bash
# Build and run all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

### Git
```bash
# Initialize repository
git init

# Create feature branch
git checkout -b feat/backend-entities

# Commit changes
git add .
git commit -m "feat: add JPA entities with validation"

# Push to remote
git push origin feat/backend-entities
```

---

## 📊 Project Status

| Phase | Tasks | Status |
|-------|-------|--------|
| **Setup** | Folders, documentation | ✅ Done |
| **Backend** | Spring Boot, entities, APIs | ⏳ Starting |
| **Frontend** | Angular, services, components | ⏳ Pending |
| **Docker** | Containerization | ⏳ Pending |
| **Testing** | Unit & integration tests | ⏳ Pending |
| **Documentation** | API docs, README | ⏳ Pending |
| **Deployment** | GCP (BONUS) | ⏳ Pending |

---

## 🎯 Success Criteria

✅ **Project is complete when:**
- [x] Folder structure set up (backend/frontend)
- [ ] All 12 REST endpoints working
- [ ] 5 entities fully implemented
- [ ] Spring Validator on all inputs
- [ ] Swagger documentation complete
- [ ] Docker containers running
- [ ] Angular frontend fully functional
- [ ] Clean Git history with meaningful commits
- [ ] All tests passing
- [ ] README and documentation complete
- [ ] Ready for production deployment

---

**Project Created: April 11, 2026**  
**Status: Ready to start Phase 2 (Backend Development)**  
**Next Step: Initialize backend Maven project**

---
