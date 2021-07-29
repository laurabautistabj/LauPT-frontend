import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationProvider} from '../../../../providers/navigation.provider';
import {CourseService} from '../../../../services/course.service';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from '../item/item.component';
import {MatSort} from "@angular/material/sort";
import {catchError, map, startWith, switchMap} from "rxjs/operators";
import firebase from "firebase";
import OrderByDirection = firebase.firestore.OrderByDirection;
import {merge, of as observableOf} from "rxjs";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, AfterViewInit {

  private courseId: string;
  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Indice', 'content'];
  data = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigationProvider: NavigationProvider,
              private courseService: CourseService,
              private matDialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.fetchData();

    merge(this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.getList(this.sort.active, this.sort.direction as OrderByDirection);
        }),
        map(data => {
          // Flip flag to show that loading has finished.

          return data;
        }),
        catchError(() => {
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          return observableOf([]);
        })
      ).subscribe(data => this.data = data);
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const params = this.activatedRoute.snapshot.params;
      if (!params.id) {
        await this.router.navigateByUrl('/professor');
      }
      this.courseId = params.id;
      this.data = await this.courseService.listUnits(this.courseId);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onCreate(): Promise<void> {
    const dialog = this.matDialog.open(ItemComponent, {
      data: {
        courseId: this.courseId
      }
    });
    dialog.afterClosed().subscribe(() => this.fetchData());
  }

  private async getList(sort: string, order: OrderByDirection): Promise<any> {
    const data = this.data.slice();
    data.sort((a, b) => {
      let sortValue = 0;
      switch (sort) {
        case 'created':
          sortValue = a[sort] - b[sort];
          break;
        default:
          sortValue = a[sort].toString().localeCompare(b[sort]);
          break;
      }
      return sortValue;
    });
    if (order === 'desc') {
      data.reverse();
    }

    return data;
  }

}
