import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthInfo } from './model/service/auth.info';
import { AuthService } from './model/service/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	constructor(public authInfo: AuthInfo, private authService: AuthService, private router: Router) { }

	logout(){
		this.authService.clear();
		this.router.navigateByUrl("/");
	}
}
