# Backend - Spring Boot REST API

Backend API for the Systeme de Gestion des Reclamations.

## Current Runtime

- Java: 17
- Spring Boot: 3.2.4
- API Port: 8087
- Database: MySQL, schema reclamations_db
- API docs: /swagger-ui.html

## Quick Start

### 1. Prerequisites

- Java 17+
- Maven 3.9+
- MySQL 8.x running locally

### 2. Database

```sql
CREATE DATABASE IF NOT EXISTS reclamations_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Verify credentials in src/main/resources/application.properties.

### 3. Build

```bash
cd backend
mvn -q -DskipTests package
```

### 4. Run

```bash
cd backend
java -jar target/reclamations-1.0.0.jar
```

Base URL:

http://localhost:8087

Swagger UI:

http://localhost:8087/swagger-ui.html

## Security and JWT

Business API routes are protected by JWT.

Public routes:

- POST /api/auth/login
- /swagger-ui/**
- /v3/api-docs/**

### Login example

Request:

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

Use the token for protected endpoints:

```http
Authorization: Bearer <jwt>
```

## API Endpoints

Authentication:

- POST /api/auth/login

Clients:

- GET /api/clients
- GET /api/clients/{id}
- POST /api/clients

Agents:

- GET /api/agents
- GET /api/agents/{id}

Produits:

- GET /api/produits
- GET /api/produits/{id}

Reclamations:

- GET /api/reclamations
- GET /api/reclamations/{id}
- POST /api/reclamations
- PUT /api/reclamations/{id}/assign
- PUT /api/reclamations/{id}/statut
- GET /api/reclamations/{id}/suivi
- POST /api/reclamations/{id}/suivi
- GET /api/reclamations/rapport

Agent self-service:

- GET /api/agents/me
- GET /api/agents/me/reclamations
- GET /api/agents/me/reclamations/{id}
- GET /api/agents/me/reclamations/{id}/suivi
- POST /api/agents/me/reclamations/{id}/suivi
- PUT /api/agents/me/reclamations/{id}/statut

Admin account management:

- GET /api/admin/agents/accounts
- GET /api/admin/agents/accounts/{id}
- POST /api/admin/agents/accounts
- PUT /api/admin/agents/accounts/{id}
- PUT /api/admin/agents/accounts/{id}/reset-password

## Package Structure

```text
src/main/java/com/project/reclamations/
├── config/
├── controller/
├── dto/
│   ├── request/
│   └── response/
├── entity/
├── enums/
├── exception/
├── mapper/
├── repository/
├── security/
└── service/
```

## Known Notes

- If mvn spring-boot:run fails from workspace root, run commands from backend directory.
- If tables are recreated unexpectedly, review spring.jpa.hibernate.ddl-auto in src/main/resources/application.properties.
- If authentication fails, verify demo credentials and JWT header format.

## Next Backend Items

- Add unit and integration tests
- Review production secrets and password policy
