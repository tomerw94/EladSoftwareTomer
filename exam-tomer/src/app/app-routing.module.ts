import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserDetailsComponent } from './pages/user-details/user-details.component';
import { InsurancePolicyFormComponent } from './pages/insurance-policy-form/insurance-policy-form.component';

const routes: Routes = [
  { path: 'user-list', component: UserListComponent },
  { path: 'user-details', component: UserDetailsComponent },
  { path: 'policy-form', component: InsurancePolicyFormComponent },
  { path: '', redirectTo: '/user-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/user-list' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
