import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { MessageComponent } from './schedule/message/message.component';
import { ProfileComponent } from './schedule/profile/profile.component';
import { BookmarksComponent } from './schedule/bookmarks/bookmarks.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { JoinedInClassesComponent } from './schedule/joined-in-classes/joined-in-classes.component';


const routes: Routes = [
  { path: 'main', component: MainComponent },
  { path: 'account', component: AccountComponent },
  { path: 'class', component: ScheduleComponent,  canActivate: [AngularFireAuthGuard],
    children: [
      { path: ':id', outlet: 'message', component: MessageComponent},
      { path: 'profile/:id', outlet: 'profile', component: ProfileComponent},
      { path: 'bookmark/:id', outlet: 'bookmark', component: BookmarksComponent},
      { path: 'joined/:id', outlet: 'joined', component: JoinedInClassesComponent}
    ]
  },
  { path: '', redirectTo: '/main', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
