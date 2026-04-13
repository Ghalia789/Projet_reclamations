# Frontend - Architecture and Setup Plan

Angular frontend for the reclamations platform.

## Target Stack

- Angular (latest stable)
- TypeScript
- RxJS
- Angular Router
- Reactive Forms
- HTTP interceptor for JWT

## Proposed Frontend Architecture

```text
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── token.service.ts
│   │   │   │   └── api-base.service.ts
│   │   │   └── core.module.ts
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── models/
│   │   │   │   ├── client.model.ts
│   │   │   │   ├── produit.model.ts
│   │   │   │   ├── agent.model.ts
│   │   │   │   └── reclamation.model.ts
│   │   │   └── shared.module.ts
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   └── auth-routing.module.ts
│   │   │   ├── dashboard/
│   │   │   ├── clients/
│   │   │   ├── produits/
│   │   │   ├── agents/
│   │   │   └── reclamations/
│   │   │       ├── reclamation-list/
│   │   │       ├── reclamation-create/
│   │   │       ├── reclamation-detail/
│   │   │       └── reclamation-report/
│   │   │
│   │   ├── app-routing.module.ts
│   │   ├── app.component.ts
│   │   └── app.module.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css
└── package.json
```

## Routing Plan

- /login
- /dashboard
- /clients
- /produits
- /agents
- /reclamations
- /reclamations/new
- /reclamations/:id
- /reclamations/report

Protected by auth guard:

- /dashboard and all business routes

Public:

- /login

## API Integration Plan

Backend base URL:

- http://localhost:8087

Endpoints to consume first:

- POST /api/auth/login
- GET /api/clients
- POST /api/clients
- GET /api/reclamations
- POST /api/reclamations

JWT strategy:

- Store token in localStorage (initial version)
- Attach Authorization: Bearer <token> in auth.interceptor.ts
- Redirect to /login on 401

## Setup Commands (When Starting Implementation)

From project root:

```bash
npm install -g @angular/cli
ng new frontend --routing --style=css
cd frontend
npm install
ng serve -o
```

## Environment Configuration

environment.ts should include:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8087'
};
```

## UI and Validation Guidelines

- Use Reactive Forms for all forms
- Display backend validation errors from ApiErrorResponse.validationErrors
- Use consistent loading and error states on every API-driven page
- Keep list/detail/create flows separated per feature module

## Next Frontend Milestones

1. Scaffold Angular app
2. Create core services (auth, token, interceptor, guard)
3. Implement login screen and JWT flow
4. Implement reclamation list/create/detail pages
5. Add clients/produits/agents management pages
6. Implement report dashboard
