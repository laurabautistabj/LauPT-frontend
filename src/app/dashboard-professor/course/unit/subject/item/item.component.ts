import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {NavigationProvider} from '../../../../../providers/navigation.provider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CourseUnitsService} from '../../../../../services/course-units.service';
import * as IMask from 'imask';
import {UnitSubjectsService} from "../../../../../services/unit-subjects.service";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit {

  itemGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    index: new FormControl('', [Validators.required]),
    questionsPerQuestionnaire: new FormControl(10, [Validators.required, Validators.min(1)]),
    timeToTryAgain: new FormControl(48, [Validators.required, Validators.min(0.01)])
  });

  indexMask = IMask.createMask({
    mask: Number,
    min: 1
  });
  questionsMask = IMask.createMask({
    mask: Number,
    min: 1
  });
  timeTryMask = IMask.createMask({
    mask: Number,
    min: 0.01,
    radix: '.'
  });

  constructor(private courseUnitsService: CourseUnitsService,
              private unitSubjectsService: UnitSubjectsService,
              private navigationProvider: NavigationProvider,
              private matDialogRef: MatDialogRef<ItemComponent>,
              @Inject(MAT_DIALOG_DATA) public info: { unitId: string, item?: any }) {
  }

  async ngOnInit(): Promise<void> {
    await this.checkForEdit();
  }

  async checkForEdit(): Promise<void> {
    if (this.info.item) {
      this.itemGroup.patchValue({
        name: this.info.item.Nombre,
        description: this.info.item.Descripcion,
        index: this.info.item.Indice,
        questionsPerQuestionnaire: this.info.item.PreguntasPorCuestionario,
        timeToTryAgain: this.info.item.TiempoVolverIntentar / 3600,
      });
    }
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      if (this.info.item) {
        await this.unitSubjectsService.update(this.info.item.id, {
          Nombre: this.itemGroup.value.name,
          Descripcion: this.itemGroup.value.description,
          Indice: this.itemGroup.value.index,
          PreguntasPorCuestionario: this.itemGroup.value.questionsPerQuestionnaire,
          TiempoVolverIntentar: this.itemGroup.value.timeToTryAgain * 60 * 60
        });
        this.info.item.Nombre = this.itemGroup.value.name;
        this.info.item.Descripcion = this.itemGroup.value.description;
        this.info.item.Indice = this.itemGroup.value.index;
        this.info.item.PreguntasPorCuestionario = this.itemGroup.value.questionsPerQuestionnaire;
        this.info.item.TiempoVolverIntentar = this.itemGroup.value.timeToTryAgain * 60 * 60;
        this.matDialogRef.close(this.info.item);
      } else {
        await this.courseUnitsService.createSubject(this.info.unitId, {
          Nombre: this.itemGroup.value.name,
          Descripcion: this.itemGroup.value.description,
          Indice: this.itemGroup.value.index,
          PreguntasPorCuestionario: this.itemGroup.value.questionsPerQuestionnaire,
          TiempoVolverIntentar: this.itemGroup.value.timeToTryAgain * 60 * 60
        });
        this.matDialogRef.close();
      }
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
