import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";

@Injectable({
    providedIn:'root'
})
export class Emailtaken implements AsyncValidator {
    constructor(public auth:AngularFireAuth){}

    validate=(control:AbstractControl):Promise<ValidationErrors|null> => {
        return this.auth.fetchSignInMethodsForEmail(control.value).then(
            resp =>resp.length ? {emailTaken:true} : null
        )
    }
}
