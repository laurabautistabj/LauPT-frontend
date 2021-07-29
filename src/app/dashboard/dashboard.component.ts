import {Component, OnInit} from '@angular/core';
import {NavigationProvider} from '../providers/navigation.provider';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit {

  isMobile = false;
  isMobile$ = this.navigationProvider.isMobile$.pipe(map(u => {
    this.isMobile = u;
    return u;
  }));

  constructor(private navigationProvider: NavigationProvider,
              private angularFireAuth: AngularFireAuth,
              private router: Router) {
  }

  ngOnInit(): void {
  }

  async onLogout(): Promise<void> {
    this.navigationProvider.showLoader();
    await this.angularFireAuth.signOut();
    await this.router.navigateByUrl('/auth');
    this.navigationProvider.hideLoader();
  }

}
