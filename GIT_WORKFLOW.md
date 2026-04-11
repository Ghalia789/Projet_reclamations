# Git Workflow - DevOps Strategy

## Branch Structure

```
main (production-ready releases)
│
└─ dev (development/staging)
   │
   └─ feature branches (feat/feat-name)
   └─ bugfix branches (fix/bug-name)
```

## Current Status

✅ **Repository initialized**
✅ **main branch**: Production-ready (protected)
✅ **dev branch**: Active development (current)
✅ **Initial commit**: "chore: initialize project structure with backend setup"

**Current Branch:** `dev`

---

## Branching Strategy

### 1. **main Branch** (Production)
- **Protected**: Only merge after thorough testing
- **Triggers**: Release ready for production
- **Protection rules**:
  - Requires pull request reviews
  - Requires all tests passing
  - No direct commits allowed
  - Tagged with version numbers

### 2. **dev Branch** (Development/Staging)
- **Active development**: All features merge here
- **Continuously tested**: CI/CD runs on every commit
- **Allows**: Feature branches, bugfixes, hotfixes
- **Current status**: ✅ Active (you are here)

### 3. **Feature Branches** (feat/*)
- **Pattern**: `feat/entity-creation`, `feat/dto-layer`, etc.
- **Created from**: `dev`
- **Merged back to**: `dev` via pull request
- **Naming convention**:
  ```
  feat/client-entity           Feature development
  feat/configure-swagger       Feature branch
  fix/validation-bug           Bugfix branch
  hotfix/critical-issue        Critical hotfix
  ```

---

## Workflow - How to Use

### **Phase: Backend Development (Current)**

#### 1. Create Feature Branch from `dev`
```bash
# Switch to dev and pull latest
git checkout dev
git pull origin dev

# Create feature branch
git checkout -b feat/jpa-entities
```

#### 2. Make Changes and Commit
```bash
# After creating entities
git add src/main/java/com/project/reclamations/entity/
git commit -m "feat: add JPA entities with validation

- Create Client entity with validation annotations
- Create Produit entity
- Create AgentSAV entity
- Create Reclamation entity with relationships
- Create SuiviReclamation audit trail entity

Entities follow Lombok pattern with @Data, @Builder, @NoArgsConstructor, @AllArgsConstructor"
```

#### 3. Push Feature Branch
```bash
# Push feature branch to origin
git push -u origin feat/jpa-entities

# or if already pushed
git push origin feat/jpa-entities
```

#### 4. Create Pull Request (PR)
```
Title: "feat: add JPA entities with validation"

Description:
## What
Added 5 JPA entities with proper relationships and validation

## Why
Essential for database layer implementation

## Changes
- Client.java (with @Email, @NotBlank)
- Produit.java
- AgentSAV.java
- Reclamation.java (with FKs)
- SuiviReclamation.java (audit trail)

## Testing
- Entities compile successfully
- Relationships properly configured
- Validation annotations applied

## Related Issue
N/A
```

#### 5. Merge to `dev`
```bash
# After PR approval
git checkout dev
git merge --no-ff feat/jpa-entities
git push origin dev
```

### **Phase: Release to Production (After All Features Complete)**

#### 1. Create Release PR from `dev` to `main`
```bash
git checkout main
git pull origin main
git merge --no-ff dev
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin v1.0.0
```

---

## Commit Message Convention

Follow **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (no logic)
- **refactor**: Code refactoring (no new features)
- **perf**: Performance improvements
- **test**: Test additions/changes
- **chore**: Build, dependencies, tooling
- **ci**: CI/CD configuration

### Examples:

```bash
# Feature commits
git commit -m "feat(entity): add client entity with validation"
git commit -m "feat(repository): create JPA repositories"
git commit -m "feat(dto): add request/response DTOs with validation"

# Bugfix commits
git commit -m "fix(validation): correct email regex pattern"
git commit -m "fix(mapping): fix entity to DTO conversion"

# Chore/docs commits
git commit -m "chore(maven): add springdoc-openapi dependency"
git commit -m "docs: update API documentation"
```

---

## Expected Commit Pattern for This Project

### Phase 1: Backend Development
```
1. feat(enum): add StatutReclamation and ActionSuivi enums ✅
2. feat(entity): add Client, Produit, AgentSAV entities
3. feat(entity): add Reclamation and SuiviReclamation entities
4. feat(repository): create JPA repository interfaces
5. feat(dto): add request DTOs with validation annotations
6. feat(dto): add response DTOs
7. feat(mapper): implement entity to DTO mappers
8. feat(service): create business logic services
9. feat(controller): add REST endpoints for clients
10. feat(controller): add REST endpoints for reclamations
11. feat(exception): add global exception handler
12. feat(security): configure Spring Security with JWT
13. feat(swagger): document all endpoints
14. docs: update API documentation
15. test: add unit tests for services
16. test: add integration tests
```

### Phase 2: Frontend Development
```
17. feat(frontend): initialize Angular project
18. feat(services): create HTTP services
19. feat(components): add complaint list page
20. feat(components): add complaint detail page
... etc
```

### Phase 3: DevOps & Testing
```
24. chore(docker): add Dockerfile for backend
25. chore(docker): add docker-compose.yml
26. test: verify containerization
27. docs: update deployment documentation
```

---

## Important Commands

### View Current Branch
```bash
git branch
git status
git log --oneline
```

### Switch Branches
```bash
git checkout dev
git checkout main
git checkout feat/my-feature
```

### Update Current Branch
```bash
git pull origin dev
```

### Push Changes
```bash
git push origin feat/my-feature
git push origin dev
```

### Create Tags (for releases)
```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

### View Branch History
```bash
git log --oneline --all --graph --decorate
```

---

## GitHub Integration - Next Steps

### ⏳ TODO: Link to GitHub

1. Create GitHub repository
   ```
   Repository name: Projet_reclamations
   Description: Customer Complaint Management System - Spring Boot 4 + Angular
   Visibility: Private or Public (your choice)
   ```

2. Add GitHub remote
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/Projet_reclamations.git
   git branch -M main
   git push -u origin main dev
   ```

3. Protect `main` branch (GitHub settings)
   - Require pull request reviews
   - Require all tests passing
   - Restrict who can push

4. Enable branch protection for `dev`
   - Require all tests passing
   - Allow merges from feature branches

---

## Current Repository Status

```
Branches:
  dev     ✅ Active development branch
  main    ✅ Production branch

Commits:
  1       "chore: initialize project structure with backend setup"

Current Location: dev branch

Remote: Not yet configured (awaiting GitHub setup)
```

---

## Workflow Summary for Team

### Daily Development Workflow:
```
1. git checkout dev && git pull origin dev
2. git checkout -b feat/your-feature
3. Make changes locally
4. git commit -m "feat(scope): description"
5. git push origin feat/your-feature
6. Open pull request on GitHub
7. Get review approval
8. Merge to dev
9. Repeat
```

### Release Workflow:
```
1. All features tested and merged to dev
2. Create PR from dev to main
3. Merge with version tag
4. Deploy to production
5. Monitor and hotfix if needed
```

---

## Protection Rules (To Configure on GitHub)

### main Branch Rules:
- ✅ Require pull request reviews before merging
- ✅ Require all tests passing
- ✅ No direct pushes allowed
- ✅ Require tags for releases

### dev Branch Rules:
- ✅ Require all tests passing
- ✅ Allow force pushes (for cleanup)

---

**Next Step:** Create GitHub repository and push both branches

```bash
# When GitHub repo is ready
git remote add origin https://github.com/YOUR_USERNAME/Projet_reclamations.git
git push -u origin main dev
```

---
