// Este es el Reducer gloval de la aplicacion
// Este es el que vamos a mandar al app.module
// Snippts: ngrxappreducers
import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';


export interface AppState {
   ui: ui.State;
   user: auth.State;
}



export const appReducers: ActionReducerMap<AppState> = {
   ui: ui.uiReducer,
   user: auth.authReducer
};

