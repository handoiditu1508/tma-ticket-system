import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { EquipmentTableComponent } from './equipment-table/equipment-table.component';
import { EquipmentEditorComponent } from './equipment-editor/equipment-editor.component';
import { UserTableComponent } from './user-table/user-table.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	declarations: [AdminComponent, EquipmentTableComponent, EquipmentEditorComponent, UserTableComponent],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild([
			{ path: "main", component: AdminComponent, },
			{ path: "equipments", component: EquipmentTableComponent },
			{ path: "equipments/:mode", component: EquipmentEditorComponent },
			{ path: "equipments/:mode/:id", component: EquipmentEditorComponent },
			{ path: "users", component: UserTableComponent },
			{ path: "**", redirectTo: "main" }
		])
	]
})
export class AdminModule { }
