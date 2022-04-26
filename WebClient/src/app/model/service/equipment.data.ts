import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EMPTY, Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Equipment } from "../equipment.model";
import { ListItemResponse } from "../list-item-response.model";
import { AuthInfo } from "./auth.info";

const PROTOCOL = "https";
const DOMAIN = "localhost:5003";

@Injectable()
export class EquipmentData {
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

	public getById(id: number): Observable<Equipment> {
		return this.httpClient
			.get<Equipment>(`${this.baseUrl}/equipments/${id}`)
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public getEquipments(model: any): Observable<ListItemResponse<Equipment>> {
		return this.httpClient
			.get<ListItemResponse<Equipment>>(`${this.baseUrl}/equipments/list`, { params: this.getParams(model) })
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public getStatuses(): Observable<ListItemResponse<any>> {
		return this.httpClient
			.get<ListItemResponse<any>>(`${this.baseUrl}/equipments/statuses`)
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public getTypes(): Observable<ListItemResponse<any>> {
		return this.httpClient
			.get<ListItemResponse<any>>(`${this.baseUrl}/equipments/types`)
			.pipe(
				map(res => res),
				catchError(val => EMPTY)
			);
	}

	public addEquipment(equipment: Equipment): Observable<number> {
		let body = {
			name: equipment.name,
			description: equipment.description,
			typeId: equipment.typeId,
			statusId: equipment.statusId
		};

		return this.httpClient
			.post<Equipment>(`${this.baseUrl}/equipments/create`, body)
			.pipe(
				map(res => res.id),
				catchError(val => of(-1))
			);
	}

	public editEquipment(equipment: Equipment): Observable<boolean> {
		let body = {
			name: equipment.name,
			description: equipment.description,
			userId: equipment.userId,
			typeId: equipment.typeId,
			statusId: equipment.statusId
		};

		return this.httpClient
			.put<any>(`${this.baseUrl}/equipments/update/${equipment.id}`, body)
			.pipe(
				map(res => true),
				catchError(val => of(false))
			);
	}

	public deleteEquipment(id: number): Observable<boolean> {
		return this.httpClient
			.delete<any>(`${this.baseUrl}/equipments/delete/${id}`)
			.pipe(
				map(res => true),
				catchError(val => of(false))
			);
	}
}