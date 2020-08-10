import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { AuthenticationService, Credentials } from '../authentication.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, BehaviorSubject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { MatSpinner, MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  loading: boolean;
  overlayRef: OverlayRef;
  spinnerComponent: ComponentPortal<MatSpinner> = new ComponentPortal(MatSpinner);

  submitBtn: MatButton;

  @ViewChild('spinner', {read: TemplateRef}) spinner: TemplateRef<any>;

  constructor(private authenticationservice: AuthenticationService,
    private snackBar: MatSnackBar,
    private overlay: Overlay) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.initOverlayRef();

    this.authenticationservice.inProgressObservable.subscribe(inProgress => {
      this.loading = inProgress;
      if (inProgress) {    
        this.overlayRef.attach(this.spinnerComponent);
      } else {
        this.overlayRef.detach();
      }
    });
  }

  enableDisableForm(disable: boolean) {
    this.submitBtn.disabled = disable;
  }

  onFailedLogin(objRef) {
    objRef.form.reset();
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.form.updateValueAndValidity();
    objRef.openSnackBar("Invalid credentials! Please try again.");
  }

  login(credentials: Credentials): void {
    if (this.form.valid) {
      this.authenticationservice.login(credentials, this.onFailedLogin, this);
    }
  }

  getLoading(): boolean {
    return this.loading;
  }

  initOverlayRef() {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    let config: AppOverlayConfig = { hasBackdrop: true };
    config['positionStrategy'] = positionStrategy;
    // Returns an OverlayRef which is a PortalHost
    this.overlayRef = this.overlay.create(config);
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
export interface AppOverlayConfig extends OverlayConfig { }
