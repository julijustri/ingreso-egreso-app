import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: AngularFireAuth,
              private authService: AuthService,
              private firestore: AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
      // Esto es para solucionar un error que salia al hacer logout
      if (fuser) {
        console.log(fuser.uid);
        console.log(fuser.email);
      }
    });
  }

  crearusuario(nombre: string, correo: string, password: string) {
    // console.log(nombre, correo, password);
    // return this.auth.createUserWithEmailAndPassword(correo, password);
    return this.auth.createUserWithEmailAndPassword(correo, password)
               .then((fbUser) => {
                 const newUser = new Usuario( fbUser.user.uid, nombre, fbUser.user.email);

                 return this.firestore.doc(`${fbUser.user.uid}/usuario`)
                     .set({...newUser});
               });
  }

  loginUsuario(correo: string, password: string) {
    // console.log(nombre, correo, password);
    return this.auth.signInWithEmailAndPassword(correo, password);
  }

  logout(){
    return this.auth.signOut();
  }

  isAuth(){
   return this.auth.authState.pipe(
     map( fbUser => fbUser != null)
   );
  }
}
