import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription;

  constructor(public auth: AngularFireAuth,
              private authService: AuthService,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      // console.log(fuser);
      // Esto es para solucionar un error que salia al hacer logout
      // console.log(this.userSubscription);
      if (fuser) {
        // console.log(fuser.uid);
        // console.log(fuser.email);
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
            .subscribe( (firestoneUser: any) => {
              // console.log(firestoneUser);
              // const temUser = new Usuario('abc', 'borrame', 'ddddd@ffff.com');
              const user = Usuario.fromFirebase( firestoneUser);
              this.store.dispatch( authActions.setUser({ user}) );
            });
      } else {
          // console.log(this.userSubscription);
          if(this.userSubscription != undefined) {
            this.userSubscription.unsubscribe();
          }
          this.store.dispatch( authActions.unSetUser());
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
