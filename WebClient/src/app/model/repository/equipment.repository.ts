import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Equipment } from '../equipment.model';
import { ListItemResponse } from '../list-item-response.model';
import { EquipmentData } from '../service/equipment.data';

@Injectable()
export class EquipmentRepository {
	private statuses: any;
	private types: any;

	constructor(private data: EquipmentData) {
		this.statuses = {};
		this.types = {};
		data.getStatuses()
			.subscribe(data => {
				data.items.forEach(value => {
					this.statuses[value.id] = value.name;
				});
			});

		data.getTypes()
			.subscribe(data => {
				data.items.forEach(value => {
					this.types[value.id] = value.name;
				});
			});
	}

	getStatuses(): any {
		if (Object.keys(this.statuses).length == 0)
			this.data.getStatuses()
				.subscribe(data => {
					data.items.forEach(value => {
						this.statuses[value.id] = value.name;
					});
				});
		return this.statuses;
	}

	getTypes(): any {
		if (Object.keys(this.types).length == 0)
			this.data.getTypes()
				.subscribe(data => {
					data.items.forEach(value => {
						this.types[value.id] = value.name;
					});
				});
		return this.types;
	}

	getEquipments(model: any): Observable<ListItemResponse<Equipment>> {
		return this.data.getEquipments(model);
	}

	getById(id: number): Observable<Equipment> {
		return this.data.getById(id);
	}

	addEquipment(equipment: Equipment): Observable<number> {
		return this.data.addEquipment(equipment);
	}

	editEquipment(equipment: Equipment): Observable<boolean> {
		return this.data.editEquipment(equipment);
	}

	deleteEquipment(id: number): Observable<boolean> {
		return this.data.deleteEquipment(id);
	}
}
