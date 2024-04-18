import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private API_ROOT = environment.urlApi;
  private API = environment.urlApi+'sysinvent_action.php';

  constructor(private http: HttpClient) {}

  // Liste des boutiques
  shopList(Action: string = 'LISTE_BOUTIQUE'): Observable<any> {
    const params = { Action };
    return this.http.get<any>(`${this.API}`, { params });
  }

  // Connexion et Obtention de token
  login(Login: string, Password: string, IDBOUTIQUE: number): Observable<any> {
    const params = { Login, Password, IDBOUTIQUE };
    return this.http.post<any>(`${this.API}`, {},  { params }).pipe(
      map(
        (response) => {
          if (response.OK === 1) {

            localStorage.setItem('token', response.Extra);
            return response;
          } else {
            return response;
          }
        })
    );
  }
  getToken() {
    return localStorage.getItem('token');
  }
  //Protection des routes
  isAuthenticated(): boolean {
    return this.getToken != null ? true : false;
  }

  //Initialiser
  initialize(Action: string = 'SYSINVENT_INITINVENTAIRE', INIT_PASSWORD: string, Token: string): Observable<any> {
    const params = { Action, INIT_PASSWORD, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }
  //Reinitialiser
  reinitialize(Action: string = 'SYSINVENT_RE_INITINVENTAIRE', INIT_PASSWORD: string, Token: string): Observable<any> {
    const params = { Action, INIT_PASSWORD, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }
  //Historiques
  HistoryList(Action: string = 'SYSINVENT_HISTORIQUE_INVENTAIRE', Token: string): Observable<any> {
    const params = { Action, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }

  // Liste Stock
  stockList(Action: string = 'SYSINVENT_LISTE_ARTILCE', Token: string): Observable<any> {
    const params = { Action, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }

  // Mise à jour du stock
  updateStock(Action: string = 'SYSINVENT_SAVE_ARTICLE', ID: number, CARTON: number, PIECE: number, Token: string): Observable<any> {
    const params = { Action, ID, CARTON, PIECE, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }

  //Annuler la mise à jour
  cancelUpdateSTock(Action: string = 'SYSINVENT_CANCELSAVE_ARTICLE', ID: number, Token: string): Observable<any> {
    const params = { Action, ID, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }

  //Comparer Inventaire
  compare(Action: string = 'SYSINVENT_COMPARE', LABEL: string, Token: string): Observable<any> {
    const params = { Action, LABEL, Token };
    return this.http.get<any>(`${this.API}`, { params });
  }
}
