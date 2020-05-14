import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BlobStorageRequest } from '../types/azure-storage';
import { tap } from 'rxjs/internal/operators/tap';
import { MsAdalAngular6Service } from 'microsoft-adal-angular6';
import { concat, mergeMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SasGeneratorService {

  _tokenKey: string = "access_token";

  _storageUri;
  get storageUri() {
    return this._storageUri;
  }

  constructor(private adalService: MsAdalAngular6Service,
    private http: HttpClient) { }

  getSasToken(): Observable<BlobStorageRequest> {

    return this.getToken().pipe(
      mergeMap(token => {

        const authtoken = `Bearer ${token}`;
        const headerss = new HttpHeaders().set('Authorization', authtoken);

        return this.http.get<BlobStorageRequest>(
          `${environment.sasGeneratorUrl}`, { headers: headerss }
        ).pipe(
          tap(sas => {
            this._storageUri = sas.storageUri;
          })
        );
      })
    );
  }

  public signIn() {
    this.adalService.login();
  }

  public signOut() {
    this.adalService.logout();
  }

  private getToken(relogin = true): Observable<any> {

    const token = this.adalService.accessToken;
    if (!token) {
      return this.login();
    }

    return this.adalService.acquireToken('https://jsp.api.jetsoftpro.com/')
      .pipe(catchError(err => {
        if (relogin) {
          return this.login();
        }
      }));

  }

  private login() {
    this.adalService.login();
    return this.getToken(false);
  }

}
