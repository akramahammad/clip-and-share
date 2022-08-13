import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class RegisterValidators {
    static match(controlname:string, matchingControlName:string):ValidatorFn{
        return (group:AbstractControl):ValidationErrors|null=>{
            let control=group.get(controlname)
            let matchingControl=group.get(matchingControlName)
        
            if(!control || !matchingControl){
                console.log('Control not found for form group')
                return {controlNotFound:true}
            }

            const errors=control.value===matchingControl.value?null:{noMatch:true}
            matchingControl.setErrors(errors)
            return errors;
        }
        
    }
}
