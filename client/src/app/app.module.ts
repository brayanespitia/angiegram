import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { routing, appRoutingProviders } from "./app.routing";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { MomentModule } from "angular2-moment";

//componentes
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { FormsModule } from "@angular/forms";
import { HomeComponent } from "./components/home/home.component";
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UsersComponent } from "./components/users/users.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { from } from "rxjs";
import { PublicationsComponent } from "./components/publications/publications.component";
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule,
    MomentModule,
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
