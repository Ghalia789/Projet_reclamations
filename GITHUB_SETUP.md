# GitHub Integration Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Fill in repository details:
   - **Repository name**: `Projet_reclamations`
   - **Description**: `Customer Complaint Management System - Spring Boot 4 + Angular`
   - **Visibility**: Choose Public or Private
   - **README**: Don't initialize (we already have one)
   - **gitignore**: Don't select (we already have one)
   - **License**: Optional (Apache 2.0 recommended)

3. Click **Create repository**

---

## Step 2: Link Local Repository to GitHub

### Get Your GitHub Repository URL
Copy the HTTPS URL from GitHub (example):
```
https://github.com/YOUR_USERNAME/Projet_reclamations.git
```

### Add Remote Origin
```bash
cd C:\Users\EliteBook\Desktop\ITBS\2GL_A_S2\JEE\Projet_reclamations

# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/Projet_reclamations.git

# Verify remote was added
git remote -v
```

**Expected output:**
```
origin  https://github.com/YOUR_USERNAME/Projet_reclamations.git (fetch)
origin  https://github.com/YOUR_USERNAME/Projet_reclamations.git (push)
```

---

## Step 3: Push Both Branches to GitHub

### Rename main and push both branches
```bash
# Ensure main is the primary branch
git branch -M main

# Push main branch
git push -u origin main

# Push dev branch
git push -u origin dev

# Verify both branches are on GitHub
git branch -a
```

**Expected output:**
```
  dev
* main
  remotes/origin/dev
  remotes/origin/main
```

---

## Step 4: Configure GitHub Branch Protection Rules

### Protect the `main` Branch (Production)

1. Go to GitHub repository → **Settings** → **Branches**
2. Click **Add rule** under "Branch protection rules"
3. Set **Branch name pattern**: `main`
4. Enable these settings:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require all tests passing
   - ✅ Restrict who can push to matching branches
   - ✅ Require code review approval (1-2 reviewers)

### Protect the `dev` Branch (Development)

1. Add another rule for **Branch name pattern**: `dev`
2. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Allow force pushes (optional, for cleanup)
   - ✅ Allow deletions (optional)

---

## Step 5: Verify Setup

```bash
# Check all branches are synced
git fetch origin
git branch -a

# Check commit history
git log --oneline --all --graph --decorate
```

---

## Complete! 🎉

Your Git workflow is ready:

```
Local Branches:
  ✅ main (production - protected)
  ✅ dev (development - active)

Remote Branches:
  ✅ origin/main
  ✅ origin/dev

Branch Protection:
  ✅ main: Protected for production releases
  ✅ dev: Protected for development stability
```

---

## Now You Can Start Development! 

### Start a Feature Branch:
```bash
git checkout dev
git pull origin dev
git checkout -b feat/jpa-entities

# Make changes...

git add .
git commit -m "feat: add JPA entities with validation"
git push origin feat/jpa-entities

# Create PR on GitHub
```

---

## GitHub Workflow URLs

- **Repository**: `https://github.com/YOUR_USERNAME/Projet_reclamations`
- **Pull Requests**: `/pulls`
- **Issues**: `/issues`
- **Wiki**: `/wiki` (optional documentation)
- **Actions**: `/actions` (CI/CD pipelines)

---

## Configure GitHub Actions (Optional - CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main, dev ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Build with Maven
        run: |
          cd backend
          mvn clean package
      - name: Run tests
        run: |
          cd backend
          mvn test
```

This will auto-run tests on every commit to `dev` and `main`.

---

## Troubleshooting

### Remote already exists
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/Projet_reclamations.git
```

### Authentication failed
```bash
# Use GitHub CLI
gh auth login

# Or generate personal access token at:
# https://github.com/settings/tokens
```

### Force sync with GitHub (if needed)
```bash
git fetch origin
git reset --hard origin/dev
```

---

**Ready to start making commits! 🚀**

Next: Create the JPA entities and push to `feat/jpa-entities` branch

---
