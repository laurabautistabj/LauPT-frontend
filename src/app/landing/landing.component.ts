import {Component, OnInit} from '@angular/core';
import {NavigationProvider} from '../providers/navigation.provider';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.sass']
})
export class LandingComponent implements OnInit {

  isMobile = false;
  isMobile$ = this.navigationProvider.isMobile$.pipe(map(u => {
    this.isMobile = u;
    return u;
  }));
  isLoggedIn$ = this.navigationProvider.isLoggedIn$;

  constructor(private navigationProvider: NavigationProvider) {
  }

  ngOnInit(): void {
  }

}
