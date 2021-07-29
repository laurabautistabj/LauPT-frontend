import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LandingComponent} from './landing.component';
import {HomeComponent} from './home/home.component';
import {AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {RegisterComponent} from "./register/register.component";
import {VerifyEmailComponent} from "./verify-email/verify-email.component";

const redirectToLanding = () => redirectLoggedInTo(['/student']);
const redirectUnauthorized = () => redirectUnauthorizedTo(['/auth']);

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
    children: [
      {
        path: '',
        redirectTo: 'auth'
      }, {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
        canActivate: [AngularFireAuthGuard],
        data: {
          authGuardPipe: redirectToLanding
        }
      }, {
        path: 'register',
        component: RegisterComponent,
        canActivate: [AngularFireAuthGuard],
        data: {
          authGuardPipe: redirectToLanding
        }
      }, {
        path: 'verify-email',
        component: VerifyEmailComponent,
        canActivate: [AngularFireAuthGuard],
        data: {
          authGuardPipe: redirectUnauthorized
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingRoutingModule {
}
