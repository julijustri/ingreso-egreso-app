import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.registroForm = this.fb.group({
     nombre: ['', Validators.required],
     correo: ['', [Validators.required, Validators.email]],
     password: ['', Validators.required]
    });
  }

  crearusuario() {
    // console.log(this.registroForm);
    // console.log(this.registroForm.valid);
    // console.log(this.registroForm.value);
    if (this.registroForm.invalid) { return; }

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading();
      }
    });

    // Uso de destructuracion
    const {nombre, correo, password} = this.registroForm.value;
    this.authService.crearusuario( nombre, correo, password)
        .then((credenciales) => {
            console.log(credenciales);
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
