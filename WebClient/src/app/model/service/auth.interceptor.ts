import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthInfo } from "./auth.info";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private info: AuthInfo) { }

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		const authReq = req.clone({
			setHeaders: {
				Authorization:  `Bearer ${this.info.authToken}`
			}
		});

		return next.handle(authReq);
	}
}