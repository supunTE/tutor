import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessageComponent } from './schedule/message/message.component';
import { ProfileComponent } from './schedule/profile/profile.component';

const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'account', component: AccountComponent },
  { path: 'class', component: ScheduleComponent, 
    children: [
      { path: ':id', outlet: 'message', component: MessageComponent},
      { path: 'profile/:id', outlet: 'message', component: ProfileComponent}
    ]
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
