import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ListItemResponse } from "../list-item-response.model";
import { User } from "../user.model";
import { AuthInfo } from "./auth.info";

const PROTOCOL = "https";
const DOMAIN = "localhost:5001";

@Injectable()
export class UserData {
	private baseUrl: string;

	constructor(private httpClient: HttpClient, private authInfo: AuthInfo) {
		this.baseUrl = `${PROTOCOL}://${DOMAIN}`;
	}

	private getParams(obj: any): HttpParams {
		let t = {};
		for (let key in obj) {
			if (obj[key] != null && obj[key] != undefined)
				t[key] = obj[key];
		}
		return new HttpParams({
			fromObject: t
		});
	}

	public authenticate(model: any): Observable<any> {
		return this.httpClient.post<any>(`${this.baseUrl}/authenticate/login`, model);
	}

	public register(model: any): Observable<any> {
		return this.httpClient.post<any>(`${this.baseUrl}/authenticate/register`, model);
	}

	public getRoles(): Observable<ListItemResponse<any>> {
		return this.httpClient
			.get<ListItemResponse<any>>(`${this.baseUrl}/users/roles`)
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public getById(id: number): Observable<User> {
		return this.httpClient
			.get<User>(`${this.baseUrl}/users/${id}`)
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public getUsers(model: any): Observable<ListItemResponse<User>> {
		return this.httpClient
			.get<ListItemResponse<User>>(`${this.baseUrl}/users/list`, { params: this.getParams(model) })
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}
}