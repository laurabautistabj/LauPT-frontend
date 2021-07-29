import {Component, OnInit} from '@angular/core';
import {LearningStyleService} from '../../services/learning-style.service';
import {NavigationProvider} from '../../providers/navigation.provider';
import {QuestionInterface} from '../../interfaces/question.interface';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {StudentLearningStyleService} from '../../services/student-learning-style.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from "@angular/router";
import {DashboardStudentProvider} from "../dashboard-student.provider";

@Component({
  selector: 'app-learning-style-questionnaire',
  templateUrl: './learning-style-questionnaire.component.html',
  styleUrls: ['./learning-style-questionnaire.component.sass']
})
export class LearningStyleQuestionnaireComponent implements OnInit {

  questionnaireFormArray = new FormArray([]);
  itemFormGroup = new FormGroup({
    questionnaire: this.questionnaireFormArray
  });

  constructor(private learningStyleService: LearningStyleService,
              private studentLearningStyleService: StudentLearningStyleService,
              private matSnackBar: MatSnackBar,
              private navigationProvider: NavigationProvider,
              private dashboardStudentProvider: DashboardStudentProvider,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    if (this.dashboardStudentProvider.learningStyle.value) {
      await this.router.navigateByUrl('/student');
      return ;
    }
    await this.fetchQuestionnaire();
  }

  private async fetchQuestionnaire(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      const questionnaire: QuestionInterface[] = await this.learningStyleService.getQuestionnaire();

      questionnaire.forEach(u => {
        this.questionnaireFormArray.push(new FormGroup({
          id: new FormControl(u.Id),
          multiple: new FormControl(u.Multiple),
          answer: new FormControl('', Validators.required),
          answers: new FormControl(u.Respuestas.sort((a, b) => b.Respuesta.localeCompare(a.Respuesta))),
          question: new FormControl(u.Pregunta)
        }));
      });
    } catch (error) {
      console.log(error);
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    const value = this.itemFormGroup.value;
    const answers = value.questionnaire.map(u => ({Pregunta: u.id, Respuesta: u.answer}));
    try {
      const learningStyle = await this.studentLearningStyleService.create(answers);
      this.dashboardStudentProvider.learningStyle.next(learningStyle);
      await this.router.navigateByUrl('/student');
    } catch (error) {
      console.log(error);
      this.matSnackBar.open(error.error.message, '', {
        verticalPosition: 'top',
        duration: 5000
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

}
