# Projet 5: Système de Gestion des Réclamations
### Customer Complaint Management System | Full-Stack Java + Angular

---

## Quick Start

```bash
# Backend
cd backend
mvn spring-boot:run

# Frontend (new terminal)
cd frontend
npm install
ng serve
```

Access:

- Backend API: http://localhost:8087
- Swagger UI: http://localhost:8087/swagger-ui.html
- Frontend: http://localhost:4200
- MySQL: localhost:3306

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Spring Boot 3.2.4 (Java 17) |
| **Frontend** | Angular (standalone) + Tailwind CSS |
| **Database** | MySQL 8 |
| **ORM** | Spring Data JPA / Hibernate |
| **Security** | Spring Security + JWT |
| **API Docs** | Swagger / OpenAPI (springdoc) |
| **Build** | Maven (backend), npm (frontend) |
| **Icons** | lucide-angular |

---

## Project Structure

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
├── PROJECT_PLAN.md                Detailed implementation roadmap
└── README.md                       This file
```

---

## Project Overview

- Backend REST API with DTOs, validators, mappers, and Swagger docs.
- Frontend Angular SPA with standalone components and Tailwind styling.
- JWT authentication with role-based access (ADMIN, AGENT).
- Admin account management and agent self-service endpoints.

**Entities:**
- `Client` - customers
- `Produit` - products/categories
- `AgentSAV` - customer service agents
- `Reclamation` - complaints (core entity)
- `SuiviReclamation` - audit trail / history

---

## Getting Started

### Prerequisites
- Java 17
- Node.js 18+ (for Angular)
- Maven 3.9+
- Git

### Local Development Setup

**1. Backend (Spring Boot)**
```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8087
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

### Notes
- Backend runs on port 8087 (see backend/src/main/resources/application.properties).
- Frontend uses environment.ts apiBaseUrl = http://localhost:8087.

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

## Authentication and Roles

- Login payload uses email/password.
- JWT claims include role and optional agentId.
- Roles: ADMIN and AGENT (front-end uses role guards).

Login example:

```http
POST /api/auth/login
Content-Type: application/json

{
      "email": "admin@company.tn",
      "password": "admin123"
}
```

Response:

```json
{
      "token": "<jwt>",
      "tokenType": "Bearer",
      "username": "admin@company.tn",
      "role": "ADMIN",
      "agentId": null
}
```

## Core Endpoints

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

### **Agent Self-Service**
```
GET  /api/agents/me                      - Get current agent profile
GET  /api/agents/me/reclamations         - My reclamations
GET  /api/agents/me/reclamations/{id}    - My reclamation detail
GET  /api/agents/me/reclamations/{id}/suivi
POST /api/agents/me/reclamations/{id}/suivi
PUT  /api/agents/me/reclamations/{id}/statut
```

### **Admin Account Management**
```
GET  /api/admin/agents/accounts
GET  /api/admin/agents/accounts/{id}
POST /api/admin/agents/accounts
PUT  /api/admin/agents/accounts/{id}
PUT  /api/admin/agents/accounts/{id}/reset-password
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
| **Operationality** | App runs correctly after local run | ☐ |
| **Architecture** | Strict REST API + Angular SPA separation | ☐ |
| **Validation** | Spring Validator on ALL API inputs (REQUIRED) | ☐ |
| **API Documentation** | Swagger/OpenAPI complete and accessible | ☐ |
| **Cloud Deployment** | GCP deployment (BONUS) | ☐ |

---

## Key Features

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
✅ **Role-Based Access** - Admin and Agent spaces with dedicated routes  
✅ **Agent Self-Service** - Agents manage assigned reclamations and suivi  
✅ **Account Management** - Admin creates and resets agent accounts  

---

## 📚 Documentation

- **[PROJECT_PLAN.md](PROJECT_PLAN.md)** - Detailed phase-by-phase roadmap
- **[backend/README.md](backend/README.md)** - Backend setup & API docs
- **[frontend/README.md](frontend/README.md)** - Frontend setup & architecture
- **Swagger UI** - Access at `http://localhost:8087/swagger-ui.html`

---

## 🔗 Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Angular Documentation](https://angular.io/docs)
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
**Status:** In progress  
**Contribution:** Follow clean Git practices and keep commits meaningful!

---
