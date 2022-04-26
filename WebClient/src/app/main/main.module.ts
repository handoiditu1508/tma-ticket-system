import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ModelModule } from '../model/models.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [MainComponent, LoginComponent, RegisterComponent],
	imports: [
		CommonModule,
		ModelModule,
		FormsModule,
		ReactiveFormsModule
	],
	exports:[
		MainComponent,
		LoginComponent,
		RegisterComponent
	]
})
export class MainModule { }
