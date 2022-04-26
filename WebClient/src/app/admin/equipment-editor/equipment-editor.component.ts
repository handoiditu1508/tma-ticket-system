import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Equipment } from 'src/app/model/equipment.model';
import { EquipmentRepository } from 'src/app/model/repository/equipment.repository';

@Component({
	selector: 'app-equipment-editor',
	templateUrl: './equipment-editor.component.html',
	styleUrls: ['./equipment-editor.component.css']
})
export class EquipmentEditorComponent {
	public model: Equipment;
	public editing: boolean;
	public errorMessage: string;
	public submitted: boolean;

	constructor(private repository: EquipmentRepository, private router: Router, private activeRoute: ActivatedRoute) {
		this.editing = activeRoute.snapshot.params["mode"] == "edit";
		this.model = new Equipment();
		if (this.editing) {
			this.repository
				.getById(activeRoute.snapshot.params["id"])
				.subscribe(data => {
					this.model = data;
				});
		}
		this.submitted = false;
	}

	get statuses(): any {
		return this.repository.getStatuses();
	}

	get types(): any {
		return this.repository.getTypes();
	}

	getObjectKeys(obj: any): string[] {
		return Object.keys(obj);
	}

	save(form: NgForm) {
		this.submitted = true;
		if (form.valid) {
			if (this.editing)
				this.repository
					.editEquipment(this.model)
					.subscribe(data => {
						if (data)
							this.router.navigateByUrl("/admin/equipments");
						this.errorMessage = "Editing Failed";
						this.submitted = false;
					})
			else this.repository
				.addEquipment(this.model)
				.subscribe(data => {
					if (data && data > 0)
						this.router.navigateByUrl(`/admin/equipments`);
					this.errorMessage = "Adding Failed";
					this.submitted = false;
				});
		}
		else {
			this.errorMessage = "Form Data Invalid";
		}
	}
}
