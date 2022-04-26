import { FormGroup, Validators } from "@angular/forms";
import { CustomFormControl } from "src/app/model/custom.form-control";

export class CustomFormGroup extends FormGroup {
	get customControls(): CustomFormControl[] {
		return Object.keys(this.controls).map(k => this.controls[k] as CustomFormControl);
	}

	getFormValidationMessages(): string[] {
		let messages: string[] = [];
		this.customControls.forEach(c => c.getValidationMessages()
			.forEach(m => messages.push(m))
		);
		return messages;
	}

	getCustomControl(key: string):CustomFormControl{
		return this.controls[key] as CustomFormControl;
	}
}