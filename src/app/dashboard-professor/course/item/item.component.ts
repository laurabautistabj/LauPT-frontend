import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../../services/course.service';
import {NavigationProvider} from '../../../providers/navigation.provider';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit {

  itemGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required])
  });

  constructor(private learningUnitService: CourseService,
              private navigationProvider: NavigationProvider,
              private matDialogRef: MatDialogRef<ItemComponent>) {
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      await this.learningUnitService.create({
        Nombre: this.itemGroup.value.name,
        Descripcion: this.itemGroup.value.description
      });
      this.matDialogRef.close();
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
