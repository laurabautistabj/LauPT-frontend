import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CourseService} from '../../../../services/course.service';
import {NavigationProvider} from '../../../../providers/navigation.provider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit {

  itemGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    index: new FormControl('', [Validators.required])
  });

  constructor(private courseService: CourseService,
              private navigationProvider: NavigationProvider,
              private matDialogRef: MatDialogRef<ItemComponent>,
              @Inject(MAT_DIALOG_DATA) private info: { courseId: string }) {
  }

  ngOnInit(): void {
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      await this.courseService.createUnit(this.info.courseId, {
        Nombre: this.itemGroup.value.name,
        Descripcion: this.itemGroup.value.description,
        Indice: this.itemGroup.value.index
      });
      this.matDialogRef.close();
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
