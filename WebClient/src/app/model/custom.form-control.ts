import { AbstractControlOptions, FormControl, ValidatorFn } from "@angular/forms";

export class CustomFormControl extends FormControl {
	public label: string;

	constructor(label: string, formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions) {
		super(formState, validatorOrOpts);
		this.label = label;
	}

	getValidationMessages(): string[] {
		let messages: string[] = [];
		if (this.errors) {
			for (let errorName in this.errors) {
				switch (errorName) {
					case "required":
						messages.push(`${this.label} is required`);
						break;
					case "minlength":
						messages.push(`${this.label} must be at least ${this.errors["minlength"].requiredLength} characters`);
						break;
					case "maxlength":
						messages.push(`${this.label} must be no more than ${this.errors["minlength"].requiredLength} characters`);
						break;
					case "pattern":
						messages.push(`The ${this.label} contains illegal characters`);
						break;
					case "email":
						messages.push(`The ${this.label} must be an email`);
						break;
					case "min":
						console.log(this.errors);
						messages.push(`The ${this.label} must be larger or equal to ${this.errors["min"].min}`);
						break;
					case "max":
						console.log(this.errors);
						messages.push(`The ${this.label} must be lesser or equal to ${this.errors["max"].max}`);
						break;
				}
			}
		}
		return messages;
	}
}