import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ProduitsComponent } from './features/produits/produits.component';
import { AgentsComponent } from './features/agents/agents.component';
import { ReclamationListComponent } from './features/reclamations/reclamation-list/reclamation-list.component';
import { ReclamationCreateComponent } from './features/reclamations/reclamation-create/reclamation-create.component';
import { ReclamationDetailComponent } from './features/reclamations/reclamation-detail/reclamation-detail.component';
import { ReclamationReportComponent } from './features/reclamations/reclamation-report/reclamation-report.component';
import { AdminAccountsComponent } from './features/admin/admin-accounts.component';
import { AgentDashboardComponent } from './features/agent/agent-dashboard.component';
import { AgentReclamationsComponent } from './features/agent/agent-reclamations.component';
import { AgentReclamationDetailComponent } from './features/agent/agent-reclamation-detail.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'admin/accounts', component: AdminAccountsComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'agent/dashboard', component: AgentDashboardComponent, canActivate: [roleGuard(['AGENT', 'ADMIN'])] },
      { path: 'agent/reclamations', component: AgentReclamationsComponent, canActivate: [roleGuard(['AGENT', 'ADMIN'])] },
      { path: 'agent/reclamations/:id', component: AgentReclamationDetailComponent, canActivate: [roleGuard(['AGENT', 'ADMIN'])] },
      { path: 'clients', component: ClientsComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'produits', component: ProduitsComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'agents', component: AgentsComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'reclamations', component: ReclamationListComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'reclamations/new', component: ReclamationCreateComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'reclamations/report', component: ReclamationReportComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] },
      { path: 'reclamations/:id', component: ReclamationDetailComponent, canActivate: [roleGuard(['ADMIN'], '/agent/dashboard')] }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
