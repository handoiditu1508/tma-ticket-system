import { Injectable } from "@angular/core";
import { User } from "../user.model";

const auth_token = "auth_token";
const token_expiration = "token_expiration";
const user = "user";
const admin_id = 1;

@Injectable()
export class AuthInfo {
	private _authToken: string;
	private _tokenExpiration: string;
	private _user: User;

	constructor() {
		this._authToken = localStorage.getItem(auth_token);
		this._tokenExpiration = localStorage.getItem(token_expiration);
		this._user = JSON.parse(localStorage.getItem(user));

		if (this.tokenExpired)
			this.clear();
	}

	public clear() {
		this._authToken = null;
		this._tokenExpiration = null;
		this._user = null;
		localStorage.removeItem(auth_token);
		localStorage.removeItem(token_expiration);
		localStorage.removeItem(user);
	}

	get authToken(): string {
		return this._authToken;
	}

	set authToken(value: string) {
		this._authToken = value;
		localStorage.setItem(auth_token, this._authToken);
	}

	get tokenExpiration(): string {
		return this._tokenExpiration;
	}

	set tokenExpiration(value: string) {
		this._tokenExpiration = value;
		localStorage.setItem(token_expiration, this._tokenExpiration);
	}

	get user(): User {
		return this._user;
	}

	set user(value: User) {
		this._user = value;
		localStorage.setItem(user, JSON.stringify(this._user));
	}

	get authenticated(): boolean {
		return this.tokenExpired ? false : this._authToken != null
	}

	get isAdmin(): boolean {
		return this._user ? this._user.roleIds.includes(admin_id) : false;
	}

	get tokenExpired(): boolean {
		return this._tokenExpiration ? new Date() >= new Date(this._tokenExpiration) : false;
	}
}