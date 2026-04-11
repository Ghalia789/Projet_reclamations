# Projet 5: Système de Gestion des Réclamations
### Customer Complaint Management System | Full-Stack Java + Angular

---

## 📋 Quick Start

```bash
# Clone and navigate
cd Projet_reclamations

# Start everything with Docker
docker-compose up

# Access the application
Backend API:    http://localhost:8080
Swagger UI:     http://localhost:8080/swagger-ui.html
Frontend:       http://localhost:4200 (if running separately)
MySQL:          localhost:3306
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 4 (Java 21) |
| **Frontend** | Angular (latest) |
| **Database** | MySQL 8 |
| **ORM** | Spring Data JPA / Hibernate |
| **Security** | Spring Security + JWT |
| **API Docs** | Swagger / OpenAPI (springdoc) |
| **Build** | Maven (backend), npm (frontend) |
| **Container** | Docker + docker-compose |

---

## 📂 Project Structure

```
Projet_reclamations/
│
├── 📁 backend/                    Spring Boot REST API
│   ├── src/
│   ├── pom.xml
│   ├── Dockerfile                 Multi-stage Docker build
│   └── README.md
│
├── 📁 frontend/                   Angular SPA
│   ├── src/
│   ├── package.json
│   ├── Dockerfile                 Nginx reverse proxy
│   └── README.md
│
├── docker-compose.yml             Orchestrate backend, frontend, MySQL
├── PROJECT_PLAN.md                Detailed implementation roadmap
└── README.md                       This file
```

---

## 🎯 Project Phases

### **Phase 1: Backend Development** ⚙️
- Configure Spring Boot 4 with Maven
- Design & implement 5 JPA entities
- Build REST API with 12 endpoints
- Implement Spring Validator on all inputs
- Create global exception handling
- Generate Swagger documentation

**Entities:**
- `Client` - customers
- `Produit` - products/categories
- `AgentSAV` - customer service agents
- `Reclamation` - complaints (core entity)
- `SuiviReclamation` - audit trail / history

### **Phase 2: Frontend Development** 🎨
- Set up Angular project
- Create 7 main pages (list, detail, form, agents, products, reports, dashboard)
- Implement JWT-based authentication
- Build responsive UI with reusable components
- Add form validation & error handling
- Create interceptors for API calls

### **Phase 3: Docker & Deployment** 🐳
- Multi-stage Dockerfile for Spring Boot
- Nginx container for Angular frontend
- `docker-compose.yml` with MySQL, backend, frontend services
- Volume mounts for persistent database

### **Phase 4: Documentation & Testing** 📚
- Auto-generated Swagger API docs
- Unit & integration tests
- API documentation
- Git commit history with clean messages

### **Phase 5: Cloud Deployment (BONUS)** ☁️
- Deploy to Google Cloud Platform (GCP)
- Cloud SQL for MySQL
- Cloud Run for Spring Boot
- Cloud Storage for Angular frontend

---

## 🚀 Getting Started

### Prerequisites
- Java 21
- Node.js 18+ (for Angular)
- Docker & Docker Compose
- Maven 3.9+
- Git

### Local Development Setup

**1. Backend (Spring Boot)**
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
```

**2. Frontend (Angular)**
```bash
cd frontend
npm install
ng serve
# Runs on http://localhost:4200
```

**3. Database**
```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE reclamations_db;
```

### Docker Production Setup
```bash
# Build and run all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 📊 Entity Relationships

```
Client (1) ──────── (N) Reclamation
                          ↓
Produit (1) ────── (N) Reclamation
                          ↓
AgentSAV (1) ─────── (N) Reclamation
                          ↓
                    (1) ──── (N) SuiviReclamation
                          ↓
                      AgentSAV (who logged action)
```

---

## 📝 Core Endpoints

### **Clients**
```
GET  /api/clients              - List all clients
POST /api/clients              - Create client
```

### **Complaints (Reclamations)**
```
GET    /api/reclamations                - List all complaints
POST   /api/reclamations                - Create complaint
PUT    /api/reclamations/{id}/assign    - Assign agent
PUT    /api/reclamations/{id}/statut    - Update status
GET    /api/reclamations/{id}/suivi     - Get history (audit trail)
POST   /api/reclamations/{id}/suivi     - Add follow-up entry
GET    /api/reclamations/rapport        - Satisfaction report
```

### **Agents & Products**
```
GET  /api/agents               - List all SAV agents
GET  /api/produits             - List all products
```

---

## ✅ Grading Criteria

| Criterion | Points | Status |
|-----------|--------|--------|
| **Git Quality** | Clean commits, meaningful messages, regular frequency | ☐ |
| **Operationality** | App runs correctly after `docker-compose up` | ☐ |
| **Architecture** | Strict REST API + Angular SPA separation | ☐ |
| **Validation** | Spring Validator on ALL API inputs (REQUIRED) | ☐ |
| **API Documentation** | Swagger/OpenAPI complete and accessible | ☐ |
| **Cloud Deployment** | GCP deployment (BONUS) | ☐ |

---

## 🔐 Key Features

✅ **Full CRUD Operations** - Create, read, update complaints  
✅ **Complaint Assignment** - Assign SAV agents to complaints  
✅ **Status Management** - Track complaint lifecycle (OUVERTE → RESOLUE)  
✅ **Audit Trail** - SuiviReclamation logs all actions automatically  
✅ **Satisfaction Rating** - 1-5 star ratings after resolution  
✅ **Report Generation** - Statistics and customer satisfaction metrics  
✅ **Input Validation** - Spring Validator on all requests  
✅ **Error Handling** - Global exception handler with structured responses  
✅ **API Documentation** - Interactive Swagger UI  
✅ **Authentication** - JWT-based security with Guards  
✅ **Docker Ready** - Single command deployment  

---

## 📚 Documentation

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Detailed phase-by-phase roadmap
- **[backend/README.md](backend/README.md)** - Backend setup & API docs
- **[frontend/README.md](frontend/README.md)** - Frontend setup & architecture
- **Swagger UI** - Access at `http://localhost:8080/swagger-ui.html`

---

## 🔗 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Angular Documentation](https://angular.io/docs)
- [Docker Documentation](https://docs.docker.com)
- [Swagger/OpenAPI Guide](https://swagger.io)

---

## 👨‍💻 Development Workflow

1. **Create feature branch** → `git checkout -b feat/entity-creation`
2. **Implement feature** → Write code with tests
3. **Commit regularly** → `git commit -m "feat: add client entity with validation"`
4. **Keep commits clean** → One feature per commit
5. **Push to origin** → `git push origin feat/entity-creation`
6. **Create pull request** → Request review
7. **Merge after approval** → `git merge --no-ff`

---

## 📌 Key Implementation Notes

- **Auto-create audit logs**: Every status change or agent assignment automatically creates a `SuiviReclamation` entry
- **Validation**: Use `@Valid` annotation on all request DTOs
- **Error handling**: Return `ResourceNotFoundException` for missing entities (404)
- **DTOs**: Keep request and response DTOs separate
- **Documentation**: Use `@Operation` and `@Tag` for Swagger
- **Security**: Use `@PreAuthorize` for role-based access

---

**Project Created:** April 11, 2026  
**Status:** Ready for implementation  
**Contribution:** Follow clean Git practices and keep commits meaningful!

---
