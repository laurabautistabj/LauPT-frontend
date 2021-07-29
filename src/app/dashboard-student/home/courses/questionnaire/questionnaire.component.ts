import {Component, Inject, OnInit, Output, EventEmitter} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UnitSubjectsService} from '../../../../services/unit-subjects.service';
import {NavigationProvider} from '../../../../providers/navigation.provider';
import {QuestionInterface} from '../../../../interfaces/question.interface';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.sass']
})
export class QuestionnaireComponent implements OnInit {
  currentQuestion: QuestionInterface;
  showPreviousResult = false;
  levelUP = {
    basico: 0,
    intermedio: 0,
    avanzado: 0
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { Id: string, Nombre: string },
              private matDialogRef: MatDialogRef<QuestionnaireComponent>,
              private unitSubjectsService: UnitSubjectsService,
              private navigationProvider: NavigationProvider,
              private matSnackBar: MatSnackBar) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchData();
    this.levelUP = {
      basico: 0,
      intermedio: 0,
      avanzado: 0
    }
  }

  private async fetchData(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const auxResponse = await this.unitSubjectsService.initQuestionnaire(this.data.Id);
      console.log("initAuxResponse", auxResponse);
      await this.manageNextQuestionResponse(auxResponse);
    } catch (error) {

    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onAnswerEmitted(questionId: string, answerId: string): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const auxResponse = await this.unitSubjectsService.submitQuestionnaireAnswer(this.data.Id, questionId, answerId, this.currentQuestion.AlumnoCursaId);
      console.log("adios-sig pregunta",auxResponse);
      if (auxResponse.Resultado) {
        this.onShowPreviousResult(auxResponse.Resultado); //aqui agregar el contador
        if(auxResponse.Resultado.Correcta === 1){
          if(auxResponse.ncNombre == "Basico")
            this.levelUP.basico = this.levelUP.basico++;
          if(auxResponse.ncNombre == "Intermedio")
            this.levelUP.basico = this.levelUP.intermedio++;
          if(auxResponse.ncNombre == "Avanzado")
            this.levelUP.basico = this.levelUP.avanzado++;
        }
      }
      await this.manageNextQuestionResponse(auxResponse);
      this.matSnackBar.open('Tu respuesta fue registrada', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } catch (e) {
      this.matSnackBar.open(e.error.message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  private onShowPreviousResult(result): void {
    this.showPreviousResult = true; 
    setTimeout(() => {
      this.showPreviousResult = false;
    }, 3000);
  }

  private async manageNextQuestionResponse(nextQuestion: any): Promise<void> {
    if (nextQuestion.TemaFinalizado) {
      //////////////////////////NOTIFIACION////////////////
      let body={nivel:"BASICO", nivel2: "Basico"};
      if(this.levelUP.basico>=2)
        body.nivel="BASICO";body.nivel2= "Basico";
      if(this.levelUP.intermedio>=2)
        body.nivel="INTERMEDIO";body.nivel2= "Intermedio";
      if(this.levelUP.avanzado>=2)
        body.nivel="AVANZADO";body.nivel2= "Avanzado";
      try {
        const auxResponse = await this.unitSubjectsService.notificationLevel(this.data.Id,body);
        console.log("notificacion", auxResponse);
      } catch (error) {
      } finally {
      }
      try {
        const auxResponse = await this.unitSubjectsService.notificationLevelResource(this.data.Id,body);
        console.log("notificacionResource", auxResponse);
      } catch (error) {
      } finally {
      }
      //////////////////////////end:NOTIFIACION////////////////
      this.matSnackBar.open('Tema Finalizado', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
      this.matDialogRef.close({
        finishSubject: true,
        data: this.data
      });
    } else {
      this.currentQuestion = nextQuestion;
    }
  }

  async onCancel(): Promise<void> {
    this.matDialogRef.close();
  }

}
