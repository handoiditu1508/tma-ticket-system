import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthInfo } from './model/service/auth.info';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private authInfo: AuthInfo) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
		if(!this.authInfo.authenticated){
			this.router.navigateByUrl("/login");
			return false;
		}
		return true;
	}
}