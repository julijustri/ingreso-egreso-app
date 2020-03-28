import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  cargando: boolean = false;
  uiSubscription: Subscription;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private store: Store<AppState>,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
     });

    this.uiSubscription = this.store.select('ui').subscribe( ui => {
            this.cargando = ui.isLoading;
            // console.log('Cargando subs login');
     });
  }

  ngOnDestroy() {
  this.uiSubscription.unsubscribe();
  }

  logearse() {
    // console.log(this.loginForm);
    // console.log(this.loginForm.valid);
    // console.log(this.loginForm.value);
    if (this.loginForm.invalid) { return; }

    this.store.dispatch( ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor',
    //   onBeforeOpen: () => {
    //     Swal.showLoading();
    //   }
    // });

     // Uso de destructuracion
    const {correo, password} = this.loginForm.value;
    this.authService.loginUsuario( correo, password)
        .then((resp) => {
            console.log(resp);
            // Swal.close();
            this.store.dispatch( ui.stopLoading());
            this.router.navigate(['/']);
        })
        .catch((err) => {
          this.store.dispatch( ui.stopLoading());
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          });
        });
 }

}
