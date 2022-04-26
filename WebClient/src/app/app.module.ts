import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MainModule } from './main/main.module';
import { LoginComponent } from './main/login/login.component';
import { RegisterComponent } from './main/register/register.component';
import { AdminGuard } from './admin.guard';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		MainModule,
		RouterModule.forRoot([
			{ path: "main", component: MainComponent },
			{ path: "login", component: LoginComponent },
			{ path: "register", component: RegisterComponent },
			{ path: "admin", loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule), canActivate: [AdminGuard] },
			{ path: "**", redirectTo: "main" }
		])
	],
	providers: [AdminGuard],
	bootstrap: [AppComponent]
})
export class AppModule { }
