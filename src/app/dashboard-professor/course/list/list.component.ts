import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from '../item/item.component';
import {CourseService} from '../../../services/course.service';
import {NavigationProvider} from '../../../providers/navigation.provider';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {

  displayedColumns: string[] = ['Nombre', 'Descripcion', 'Activa', 'content'];
  data = [];

  constructor(private matDialog: MatDialog,
              private learningUnitService: CourseService,
              private navigationProvider: NavigationProvider) {
  }

  ngOnInit(): void {
    this.fetchData().then();
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.data = await this.learningUnitService.list();
    } catch (e) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onCreate(): Promise<void> {
    const dialog = this.matDialog.open(ItemComponent);
    dialog.afterClosed().subscribe(() => this.fetchData());
  }

}
