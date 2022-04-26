import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomFormControl } from 'src/app/model/custom.form-control';
import { CustomFormGroup } from 'src/app/model/custom.form-group';
import { Equipment } from 'src/app/model/equipment.model';
import { EquipmentRepository } from 'src/app/model/repository/equipment.repository';

@Component({
	selector: 'app-equipment-table',
	templateUrl: './equipment-table.component.html',
	styleUrls: ['./equipment-table.component.css']
})
export class EquipmentTableComponent {
	public itemsPerPage: number;
	public selectedPage: number;
	public equipments: Equipment[];
	public totalItem: number;
	public form: CustomFormGroup;

	constructor(private repository: EquipmentRepository) {
		this.itemsPerPage = 6;
		this.selectedPage = 1;
		this.totalItem = 0;
		this.form = new CustomFormGroup({
			typeId: new CustomFormControl("Type", null, Validators.min(1)),
			statusId: new CustomFormControl("Status", null, Validators.min(1)),
			userId: new CustomFormControl("Owner", null, Validators.min(1))
		});

		this.loadEquipments();
	}

	public loadEquipments() {
		let model = this.form.value;
		model.skip = this.itemsPerPage * (this.selectedPage - 1);
		model.offset = this.itemsPerPage;
		this.repository
			.getEquipments(model)
			.subscribe(data => {
				this.equipments = data.items;
				this.totalItem = data.totalItem;
			});
	}

	get statuses(): any {
		return this.repository.getStatuses();
	}

	get types(): any {
		return this.repository.getTypes();
	}

	get pageNumbers(): number[] {
		return Array(Math.ceil(this.totalItem / this.itemsPerPage))
			.fill(0).map((x, i) => i + 1);
	}

	getObjectKeys(obj: any): string[] {
		return Object.keys(obj);
	}

	changePage(page: number) {
		this.selectedPage = page;
		this.loadEquipments();
	}

	deleteEquipment(id: number) {
		this.repository
			.deleteEquipment(id)
			.subscribe(data => {
				if (data) {
					if (Math.ceil((this.totalItem - 1) / this.itemsPerPage) < this.selectedPage)
						this.selectedPage = Math.max(this.selectedPage - 1, 1);
					console.log(this.selectedPage);
					this.loadEquipments();
				}
				else {
					alert("Deleting Failed");
				}
			})
	}

	getKey(index: number, equipment: Equipment) {
		return equipment.id;
	}
}
