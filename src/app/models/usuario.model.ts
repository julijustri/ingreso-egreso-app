

export class Usuario {

  static fromFirebase( { email, nombre, uid } ) {
    return new Usuario( email, nombre, uid);
  }

  constructor(
    public uid: string,
    public nombre: string,
    public email: string
  ) {}

}
