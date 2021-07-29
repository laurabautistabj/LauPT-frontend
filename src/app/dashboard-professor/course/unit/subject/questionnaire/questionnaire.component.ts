import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ItemComponent} from './item/item.component';
import {NavigationProvider} from '../../../../../providers/navigation.provider';
import {ActivatedRoute, Router} from '@angular/router';
import {UnitSubjectsService} from '../../../../../services/unit-subjects.service';
import {ConfirmDialogComponent} from '../../../../../shared/confirm-dialog/confirm-dialog.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.sass']
})
export class QuestionnaireComponent implements OnInit {

  data: { Nombre: string, id: string };
  questionnaire: {
    Id: string,
    Multiple: boolean,
    Pregunta: string,
    Nivel: string,
    Imagen?: string,
    Respuestas: {
      Correcta: boolean,
      Id: string,
      Respuesta: string
    }[]
  }[] = [];

  constructor(private matDialog: MatDialog,
              private matSnackBar: MatSnackBar,
              private navigationProvider: NavigationProvider,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private unitSubjectsService: UnitSubjectsService) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchSubjectData();
    await this.fetchData();
  }

  private async fetchSubjectData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const params = this.activatedRoute.snapshot.params;
      if (!params.id) {
        await this.router.navigateByUrl('/professor');
      }
      this.data = await this.unitSubjectsService.retrieve(params.id);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      this.questionnaire = await this.unitSubjectsService.listQuestions(this.data.id);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onNewQuestion(editQuestion?: any): Promise<void> {
    await this.matDialog.open(ItemComponent, {
      data: {
        subjectId: this.data.id,
        editQuestion
      },
      panelClass: 'responsive-full-screen-dialog'
    }).afterClosed().toPromise();
    await this.fetchData();
  }

  async onDeleteQuestion(question: any): Promise<void> {
    const confirm = await this.matDialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar pregunta',
        message: '¿Confirma la eliminación de la pregunta?'
      }
    }).afterClosed().toPromise();

    if (!confirm) {
      return;
    }

    this.navigationProvider.showLoader();
    try {
      await this.unitSubjectsService.deleteQuestion(question.Id);
      this.matSnackBar.open('Pregunta eliminada con éxito', '', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.questionnaire.splice(this.questionnaire.findIndex(u => u.Id === question.Id), 1);
    } catch (error) {
      this.matSnackBar.open(error.error.message, '', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
