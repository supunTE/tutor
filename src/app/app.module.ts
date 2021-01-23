import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConnectionServiceModule } from 'ng-connection-service';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatRadioModule } from '@angular/material/radio';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
import { AccountComponent } from './account/account.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { BookmarksComponent } from './schedule/bookmarks/bookmarks.component';
import { MessageComponent } from './schedule/message/message.component';
import { ProfileComponent } from './schedule/profile/profile.component';
import { LinebrPipe } from './pipes/linebr.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JoinedInClassesComponent } from './schedule/joined-in-classes/joined-in-classes.component';
import { UserHeadComponent } from './schedule/profile/user-head/user-head.component';
import { LinksComponent } from './schedule/joined-in-classes/links/links.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MainComponent,
    AccountComponent,
    ScheduleComponent,
    BookmarksComponent,
    MessageComponent,
    ProfileComponent,
    LinebrPipe,
    JoinedInClassesComponent,
    UserHeadComponent,
    LinksComponent
  ],
  imports: [
    MatSliderModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    BrowserModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    MatRadioModule,
    MatNativeDateModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    CommonModule,
    BrowserAnimationsModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
