import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { ScheduleComponent } from './schedule/schedule.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'account', component: AccountComponent },
  { path: 'schedule', component: ScheduleComponent },
  // { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
