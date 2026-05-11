# Frontend - Angular SPA

Angular frontend for the reclamations platform.

## Stack

- Angular (standalone components)
- TypeScript
- RxJS
- Angular Router
- Reactive Forms + Template-driven forms
- HTTP interceptor for JWT
- Tailwind CSS
- lucide-angular icons

## Project Structure (current)

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

## Routes

Public:

- /login

Admin:

- /dashboard
- /clients
- /produits
- /agents
- /reclamations
- /reclamations/new
- /reclamations/:id
- /reclamations/report
- /admin/accounts

Agent:

- /agent/dashboard
- /agent/reclamations
- /agent/reclamations/:id

## API Integration

Backend base URL:

- http://localhost:8087

JWT strategy:

- Store token, role, agentId, email in localStorage
- Attach Authorization: Bearer <token> in auth.interceptor.ts
- Redirect to /login on 401
- Role guard protects admin and agent routes

## Local Setup

From project root:

```bash
npm install -g @angular/cli
cd frontend
npm install
ng serve
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

## Current Features

- JWT login (email/password)
- Admin dashboard and management pages
- Agent dashboard and assigned reclamations
- Role-based navigation and guards
- Toast notifications and status/priorite pills
