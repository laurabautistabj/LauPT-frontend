import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NavigationProvider} from '../../providers/navigation.provider';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit, OnDestroy {
  private subscription = new Subscription();
  showLoader = false;

  constructor(private navigationProvider: NavigationProvider) {
  }

  ngOnInit(): void {
    const loader = this.navigationProvider.loaderEvent$.subscribe(value => this.showLoader = value);
    this.subscription.add(loader);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
