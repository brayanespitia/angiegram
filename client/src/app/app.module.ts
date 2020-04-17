import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { routing, appRoutingProviders } from "./app.routing";
import { HttpClientModule, HttpClient } from "@angular/common/http";

//componentes
import { AppComponent } from "./app.component";
import { LoginComponent } from "./components/login/login.component";
import { RegisterComponent } from "./components/register/register.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent],
  imports: [BrowserModule, routing, FormsModule, HttpClientModule],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
