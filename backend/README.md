# Backend - Spring Boot REST API

## Project Setup Complete ✅

This is the Spring Boot 4 (Java 21) REST API backend for the **Système de Gestion des Réclamations** (Customer Complaint Management System).

## Quick Start

### Prerequisites
- Java 21 JDK installed
- Maven 3.9+
- MySQL 8.0 installed and running

### Build Project
```bash
# From the backend directory
mvn clean install
```

### Run Application
```bash
# Run the Spring Boot application
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080`

### Access Swagger Documentation
```
http://localhost:8080/swagger-ui.html
```

## Database Setup

### Create MySQL Database
```sql
CREATE DATABASE reclamations_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Configure Database Connection
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/reclamations_db
spring.datasource.username=root
spring.datasource.password=root
```

**Note:** Tables will be auto-created on first run (ddl-auto=create-drop)

## Project Structure

```
src/main/java/com/project/reclamations/
├── entity/                 JPA entities (5 total)
│   ├── Client.java
│   ├── Produit.java
│   ├── AgentSAV.java
│   ├── Reclamation.java
│   └── SuiviReclamation.java
│
├── enums/                  Enumerations
│   ├── StatutReclamation.java
│   └── ActionSuivi.java
│
├── repository/             Spring Data JPA repositories
│   ├── ClientRepository.java
│   ├── ProduitRepository.java
│   ├── AgentSAVRepository.java
│   ├── ReclamationRepository.java
│   └── SuiviReclamationRepository.java
│
├── dto/                    Data Transfer Objects
│   ├── request/            Input DTOs (with @Valid validation)
│   │   ├── ClientRequestDTO.java
│   │   ├── ReclamationRequestDTO.java
│   │   └── ...
│   └── response/           Output DTOs
│       ├── ClientResponseDTO.java
│       ├── ReclamationResponseDTO.java
│       └── ...
│
├── mapper/                 Entity ↔ DTO mappers
│   ├── ClientMapper.java
│   ├── ReclamationMapper.java
│   └── ...
│
├── service/                Business logic services
│   ├── ClientService.java
│   ├── ReclamationService.java
│   ├── ReportService.java
│   └── ...
│
├── controller/             REST API endpoints
│   ├── ClientController.java
│   ├── ReclamationController.java
│   └── ...
│
├── exception/              Exception handling
│   ├── ResourceNotFoundException.java
│   └── GlobalExceptionHandler.java
│
├── security/               Security configuration
│   └── SecurityConfig.java
│
└── ReclamationsApplication.java  Entry point
```

## REST API Endpoints (12 Total)

### Clients (2)
```
GET    /api/clients              → List all clients
POST   /api/clients              → Create new client
```

### Reclamations (7) - Core Functionality
```
GET    /api/reclamations         → List all complaints
POST   /api/reclamations         → Create new complaint
PUT    /api/reclamations/{id}/assign       → Assign agent
PUT    /api/reclamations/{id}/statut       → Update status
GET    /api/reclamations/{id}/suivi        → Get audit trail
POST   /api/reclamations/{id}/suivi        → Add follow-up
GET    /api/reclamations/rapport           → Satisfaction report
```

### Reference Data (3)
```
GET    /api/agents               → List all SAV agents
GET    /api/produits             → List all products
```

## Dependencies

### Core Spring Boot
- spring-boot-starter-web (REST API)
- spring-boot-starter-data-jpa (Database)
- spring-boot-starter-security (Authentication)
- spring-boot-starter-validation (Input validation)

### Database
- mysql-connector-java 8.0.33

### Utilities
- lombok (Boilerplate reduction)
- springdoc-openapi-starter-webmvc-ui (Swagger)
- jjwt (JWT for authentication)

### Testing
- spring-boot-starter-test
- spring-security-test
- h2database (In-memory DB for tests)

## Implementation Status

- [x] Project setup with Maven
- [x] Enums (StatutReclamation, ActionSuivi)
- [ ] JPA Entities (5 total)
- [ ] Repositories (5 repositories)
- [ ] DTOs (10 total: 5 request + 5 response)
- [ ] Mappers (5 mappers)
- [ ] Services (6 services)
- [ ] Controllers (4 controllers with 12 endpoints)
- [ ] Exception handling
- [ ] Swagger documentation
- [ ] Security configuration
- [ ] Unit tests
- [ ] Integration tests

## Next Steps

1. **Create JPA Entities** - Start with Client entity
2. **Create Repositories** - Extend JpaRepository
3. **Create DTOs with Validation** - Request and response DTOs
4. **Implement Mappers** - Convert between entities and DTOs
5. **Create Services** - Business logic layer
6. **Create Controllers** - REST endpoints
7. **Add Swagger Annotations** - Document endpoints
8. **Test Endpoints** - Use Postman/Thunder Client
9. **Implement Security** - JWT and Spring Security
10. **Write Tests** - Unit and integration tests

## Database Relationships

```
Client (1) ──────── (N) Reclamation ────────── (1) AgentSAV
                         ↓
           Produit (1) ──- 
                         ↓
           (1) ──────── (N) SuiviReclamation ──────── (1) AgentSAV

Key Fields:
- Reclamation.client_id → Client.id
- Reclamation.agent_id → AgentSAV.id
- Reclamation.produit_id → Produit.id
- SuiviReclamation.reclamation_id → Reclamation.id
- SuiviReclamation.agent_id → AgentSAV.id
```

## Configuration Files

- `pom.xml` - Maven dependencies and build configuration
- `application.properties` - Spring Boot configuration
- `.gitignore` - Git ignore rules

## Important Notes

- **Validation**: Use @Valid on all request DTOs for automatic Spring validation
- **Enums**: Used for StatutReclamation (OUVERTE|EN_COURS|RESOLUE|FERMEE) and ActionSuivi
- **Auto Audit Trail**: Every status change/agent assignment creates SuiviReclamation entry
- **Error Handling**: Use ResourceNotFoundException for 404 errors
- **DTOs**: Keep request and response DTOs separate
- **Swagger**: All endpoints must have @Operation and @Tag annotations
- **Security**: Use @PreAuthorize for role-based access control

## Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn clean test jacoco:report

# Run single test class
mvn test -Dtest=ClientServiceTest
```

## Build for Production

```bash
# Clean build
mvn clean package

# Create executable JAR
java -jar target/reclamations-1.0.0.jar
```

## Troubleshooting

### Connection to MySQL fails
- Check MySQL service is running
- Verify database name, username, password in application.properties
- Ensure MySQL driver is in classpath

### Port 8080 already in use
- Change server.port in application.properties
- Kill process using 8080: `lsof -i :8080`

### Swagger UI not available
- Check springdoc-openapi dependency is added to pom.xml
- Access http://localhost:8080/swagger-ui.html
- Check logs for initialization errors

## Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/projects/spring-data-jpa)
- [Spring Security Documentation](https://spring.io/projects/spring-security)
- [Swagger/OpenAPI Documentation](https://swagger.io)
- [Lombok Project](https://projectlombok.org)

---

**Next:** Create the first JPA entity - Client.java

**Status:** ✅ Backend project structure ready for development
