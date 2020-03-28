import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
     });
  }

  logearse() {
    // console.log(this.loginForm);
    // console.log(this.loginForm.valid);
    // console.log(this.loginForm.value);
    if (this.loginForm.invalid) { return; }

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

     // Uso de destructuracion
    const {correo, password} = this.loginForm.value;
    this.authService.loginUsuario( correo, password)
        .then((resp) => {
            console.log(resp);
            Swal.close();
            this.router.navigate(['/']);
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message
          });
        });
 }

}
