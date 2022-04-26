import { Component } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormControl } from 'src/app/model/custom.form-control';
import { CustomFormGroup } from 'src/app/model/custom.form-group';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	public errorMessage: string;
	public submitted: boolean;
	public form: CustomFormGroup;

	constructor(private authService: AuthService, private router: Router) {
		this.submitted = false;
		this.form = new CustomFormGroup({
			username: new CustomFormControl("Username", null, [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(20),
				Validators.pattern("^[A-Za-z0-9]+$"),
			]),
			password: new CustomFormControl("Password", null, Validators.required)
		});
	}

	login(form: NgForm) {
		this.submitted = true;
		if (form.valid) {
			this.authService.authenticate(this.form.value).subscribe(response => {
				if (response) {
					this.submitted = false;
					this.router.navigateByUrl("/");
				}
				this.errorMessage = "Authentication Failed";
			});
		}
	}
}
