import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthInfo } from './auth.info';
import { UserData } from './user.data';

@Injectable()
export class AuthService {
	constructor(private data: UserData, public info: AuthInfo) { }

	authenticate(model: any): Observable<boolean> {
		return this.data.authenticate(model).pipe(
			map(res => {
				if (res.success) {
					this.info.authToken = res.token;
					this.info.tokenExpiration = res.expiration;
					this.info.user = res.user;
				}
				return res.success;
			}),
			catchError(val => of(false))
		);;
	}

	get authenticated(): boolean {
		return this.info.authenticated;
	}

	clear() {
		this.info.clear();
	}

	register(model: any): Observable<boolean> {
		return this.data.register(model).pipe(
			map(res => true),
			catchError(val => of(false))
		);
	}
}
