import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ClientsComponent } from './features/clients/clients.component';
import { ProduitsComponent } from './features/produits/produits.component';
import { AgentsComponent } from './features/agents/agents.component';
import { ReclamationListComponent } from './features/reclamations/reclamation-list/reclamation-list.component';
import { ReclamationCreateComponent } from './features/reclamations/reclamation-create/reclamation-create.component';
import { ReclamationDetailComponent } from './features/reclamations/reclamation-detail/reclamation-detail.component';
import { ReclamationReportComponent } from './features/reclamations/reclamation-report/reclamation-report.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'produits', component: ProduitsComponent },
      { path: 'agents', component: AgentsComponent },
      { path: 'reclamations', component: ReclamationListComponent },
      { path: 'reclamations/new', component: ReclamationCreateComponent },
      { path: 'reclamations/:id', component: ReclamationDetailComponent },
      { path: 'reclamations/report', component: ReclamationReportComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
