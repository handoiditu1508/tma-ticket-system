import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { CustomFormControl } from 'src/app/model/custom.form-control';
import { CustomFormGroup } from 'src/app/model/custom.form-group';
import { EquipmentRepository } from 'src/app/model/repository/equipment.repository';
import { UserRepository } from 'src/app/model/repository/user.repository';
import { User } from 'src/app/model/user.model';

@Component({
	selector: 'app-user-table',
	templateUrl: './user-table.component.html',
	styleUrls: ['./user-table.component.css']
})
export class UserTableComponent {
	public itemsPerPage: number;
	public selectedPage: number;
	public users: User[];
	public totalItem: number;
	public userEquipments: any;
	public form: CustomFormGroup;

	constructor(private userRepository: UserRepository, private equipmentRepository: EquipmentRepository) {
		this.itemsPerPage = 6;
		this.selectedPage = 1;
		this.totalItem = 0;
		this.userEquipments = {};
		this.form = new CustomFormGroup({
			roleId: new CustomFormControl("Role", null, Validators.min(1))
		});

		this.loadUsers();
	}

	public loadUsers() {
		let model = this.form.value;
		model.skip = this.itemsPerPage * (this.selectedPage - 1);
		model.offset = this.itemsPerPage;
		this.userRepository
			.getUsers(model)
			.subscribe(data => {
				this.users = data.items;
				this.totalItem = data.totalItem;
			});
	}

	get roles(): any {
		return this.userRepository.getRoles();
	}

	get types(): any {
		return this.equipmentRepository.getTypes();
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
		this.loadUsers();
	}

	loadUserEquipments(userId: number) {
		let model: any = {};
		model.userId = userId;
		this.equipmentRepository
			.getEquipments(model)
			.subscribe(data => {
				this.userEquipments[userId] = data.items;
			})
	}

	getKey(index: number, user: User) {
		return user.id;
	}
}
