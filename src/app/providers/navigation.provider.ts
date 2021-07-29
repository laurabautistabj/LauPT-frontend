import {EventEmitter, Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class NavigationProvider {
  private _loaderEvent$ = new EventEmitter<boolean>();

  private _isMobile$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(map(u => u.matches));
  private _isLoggedIn$ = this.angularFireAuth.user.pipe(map(u => !!u));
  private _scrollTo = new BehaviorSubject(0);

  constructor(private breakpointObserver: BreakpointObserver,
              private angularFireAuth: AngularFireAuth) {
  }

  showLoader(): void {
    this._loaderEvent$.emit(true);
  }

  hideLoader(): void {
    this._loaderEvent$.emit(false);
  }

  scrollToTop(): void {
    this._scrollTo.next(0);
  }

  get loaderEvent$(): EventEmitter<boolean> {
    return this._loaderEvent$;
  }

  get isMobile$(): Observable<boolean> {
    return this._isMobile$;
  }

  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$;
  }

  get scrollTo(): BehaviorSubject<number> {
    return this._scrollTo;
  }
}
