import { DomSanitizer } from '@angular/platform-browser';
import { AbstractControl, ValidationErrors, FormControl, NG_VALIDATORS } from '@angular/forms';
import { SecurityContext, Directive, forwardRef } from '@angular/core';

@Directive({
  selector: '[sanitize][formControlName]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => SanitizeValidator), multi: true }
  ]
})
export class SanitizeValidator {
  validator: Function;

  constructor(private sanitizer: DomSanitizer) {
    this.validator = isSafeHtml(sanitizer);
  }

  validate(c: FormControl) {
    return this.validator(c);
  }
}

function isSafeHtml(sanitizer: DomSanitizer) {
  return (control: AbstractControl) => {
    let value: string = control.value;
    if (value === sanitizer.sanitize(SecurityContext.HTML, value)) {
      return null;
    }

    return { 'isUnsafe': true };
  }
}