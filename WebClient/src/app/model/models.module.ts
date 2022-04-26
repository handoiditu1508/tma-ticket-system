import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UserRepository } from './repository/user.repository';
import { EquipmentRepository } from './repository/equipment.repository';
import { AuthService } from './service/auth.service';
import { UserData } from './service/user.data';
import { EquipmentData } from './service/equipment.data';
import { AuthInfo } from './service/auth.info';
import { AuthInterceptor } from './service/auth.interceptor';

@NgModule({
	declarations: [
	],
	imports: [
		HttpClientModule
	],
	providers: [
		UserRepository,
		EquipmentRepository,
		AuthService,
		UserData,
		EquipmentData,
		AuthInfo,
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	]
})
export class ModelModule { }
