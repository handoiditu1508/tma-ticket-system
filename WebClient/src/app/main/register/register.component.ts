import { Component } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomFormControl } from 'src/app/model/custom.form-control';
import { CustomFormGroup } from 'src/app/model/custom.form-group';
import { UserRepository } from 'src/app/model/repository/user.repository';
import { AuthService } from 'src/app/model/service/auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent {
	public errorMessage: string;
	public submitted: boolean;
	public form: CustomFormGroup;

	constructor(private authService: AuthService, private router: Router, private repository: UserRepository) {
		this.submitted = false;
		this.form = new CustomFormGroup({
			username: new CustomFormControl("Username", null, [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(20),
				Validators.pattern("^[A-Za-z0-9]+$"),
			]),
			password: new CustomFormControl("Password", null, [
				Validators.required,
				Validators.minLength(6),
				Validators.maxLength(20),
				Validators.email
			]),
			email: new CustomFormControl("Email", null, [
				Validators.required,
				Validators.pattern("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$")
			]),
			roleIds: new CustomFormControl("Roles", null, [
				Validators.required,
				Validators.min(1)
			]),
		})
	}

	register(form: NgForm) {
		this.submitted = true;
		if (form.valid) {
			this.authService.register(this.form.value).subscribe(response => {
				if (response)
					this.router.navigateByUrl("/login");
				this.errorMessage = "Register Failed";
				this.submitted = false;
			});
		}
	}

	get roles(): any {
		return this.repository.getRoles();
	}

	getObjectKeys(obj: any): string[] {
		return Object.keys(obj);
	}
}
