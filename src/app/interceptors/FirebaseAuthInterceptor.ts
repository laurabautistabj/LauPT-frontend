import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {switchMap, take} from 'rxjs/operators';

@Injectable()
export class FirebaseAuthInterceptor implements HttpInterceptor {

  constructor(private angularFireAuth: AngularFireAuth) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return this.angularFireAuth.idToken.pipe(
      take(1), // <-------------- only emit the first value!

      switchMap((token: any) => {
        if (token) {
          req = req.clone({
            setHeaders: {Authorization: `Bearer ${token}`}
          });
        }
        return next.handle(req);
      })
    );
  }

}
