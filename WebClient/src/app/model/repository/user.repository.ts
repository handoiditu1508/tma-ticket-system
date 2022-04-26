import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { ListItemResponse } from '../list-item-response.model';
import { UserData } from '../service/user.data';
import { User } from '../user.model';

@Injectable()
export class UserRepository {
	public roles: any;
	public baseUrl = "https://localhost:5001";

	constructor(private data: UserData) {
		this.roles = {};
		data.getRoles()
			.subscribe(data => {
				data.items.forEach(value => {
					this.roles[value.id] = value.name;
				});
			});
	}

	public getbyId(id: number): Observable<User> {
		return this.data.getById(id);
	}

	public getUsers(model: any): Observable<ListItemResponse<User>> {
		return this.data.getUsers(model);
	}

	public getRoles(): any {
		if (Object.keys(this.roles).length == 0)
			this.data.getRoles()
				.subscribe(data => {
					data.items.forEach(value => {
						this.roles[value.id] = value.name;
					});
				});
		return this.roles;
	}
}
