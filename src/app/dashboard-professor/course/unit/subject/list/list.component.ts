import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NavigationProvider} from '../../../../../providers/navigation.provider';
import {MatDialog} from '@angular/material/dialog';
import {CourseUnitsService} from '../../../../../services/course-units.service';
import {ItemComponent} from '../item/item.component';
import firebase from 'firebase';
import OrderByDirection = firebase.firestore.OrderByDirection;
import {MatSort} from '@angular/material/sort';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {ResourcesComponent} from "../resources/resources.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit, AfterViewInit {

  private unitId: string;
  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Indice', 'PreguntasPorCuestionario', 'TiempoVolverIntentar', 'resources', 'content', 'edit'];
  data = [];

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private navigationProvider: NavigationProvider,
              private courseUnitsService: CourseUnitsService,
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
      this.unitId = params.id;
      this.data = await this.courseUnitsService.listSubjects(this.unitId);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onCreate(): Promise<void> {
    const dialog = this.matDialog.open(ItemComponent, {
      data: {
        unitId: this.unitId
      }
    });
    dialog.afterClosed().subscribe(() => this.fetchData());
  }

  async onEdit(item: any): Promise<void> {
    const dialog = this.matDialog.open(ItemComponent, {
      data: {
        unitId: this.unitId,
        item
      }
    });
    const aux = await dialog.afterClosed().toPromise();
    if (!aux) {
      return ;
    }
    item = aux;
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

  async openResources(subject: any): Promise<void> {
    this.matDialog.open(ResourcesComponent, {
      data: subject,
      panelClass: 'responsive-full-screen-dialog'
    });
  }

}
