import {Component, Inject, OnInit} from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';
import {CourseUnitsService} from '../../../../../../services/course-units.service';
import {NavigationProvider} from '../../../../../../providers/navigation.provider';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {KnowledgeLevelService} from '../../../../../../services/knowledge-level.service';
import {UnitSubjectsService} from '../../../../../../services/unit-subjects.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AngularFireStorage} from "@angular/fire/storage";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.sass']
})
export class ItemComponent implements OnInit {

  answers = new FormArray([], [Validators.minLength(2)]);
  itemGroup = new FormGroup({
    knowledgeLevel: new FormControl('', [Validators.required]),
    question: new FormControl('', [Validators.required]),
    answers: this.answers,
    imageURL: new FormControl(''),
    imageFile: new FormControl('')
  });

  knowledgeLevels = [];

  constructor(private knowledgeLevelService: KnowledgeLevelService,
              private unitSubjectsService: UnitSubjectsService,
              private navigationProvider: NavigationProvider,
              private matDialogRef: MatDialogRef<ItemComponent>,
              private matSnackBar: MatSnackBar,
              private angularFireStorage: AngularFireStorage,
              @Inject(MAT_DIALOG_DATA) public info: { subjectId: string, editQuestion?: any }) {
  }

  async ngOnInit(): Promise<void> {
    this.navigationProvider.showLoader();
    this.knowledgeLevels = await this.knowledgeLevelService.list();
    if (this.info.editQuestion) {
      this.itemGroup.patchValue({
        question: this.info.editQuestion.Pregunta,
        imageURL: this.info.editQuestion.Imagen,
        knowledgeLevel: this.knowledgeLevels.find(u => u.Nombre === this.info.editQuestion.Nivel).id
      });
      this.info.editQuestion.Respuestas.forEach(u => this.addAnswer(u.Respuesta, u.Correcta));
    }
    this.navigationProvider.hideLoader();
  }

  async onSubmit(): Promise<void> {
    this.navigationProvider.showLoader();
    try {
      if (this.info.editQuestion) {
        await this.unitSubjectsService.deleteQuestion(this.info.editQuestion.Id);
      }
      if (this.itemGroup.value.imageFile) {
        const photoRef = this.angularFireStorage.storage
          .ref('questionImage')
          .child(this.info.subjectId)
          .child(`${this.itemGroup.value.question.toString().replace(/ /g, '').trim().substr(0, 8)}-${new Date().getTime()}`);
        await photoRef.put(this.itemGroup.value.imageFile);
        this.itemGroup.get('imageURL').setValue(await photoRef.getDownloadURL());
        this.itemGroup.get('imageFile').reset();
      }
      await this.unitSubjectsService.createQuestion(this.info.subjectId, this.itemGroup.value);
      console.log("info para crear una pregunta",this.info.subjectId, this.itemGroup.value)
      this.info.editQuestion = null;
      this.matSnackBar.open('Pregunta agregada, ingrese una nueva o cierre la ventana', '', {duration: 3000});
      this.answers.controls.forEach(u => u.patchValue({
        answer: '',
        isCorrect: false
      }));
      this.itemGroup.get('question').reset();
      this.itemGroup.get('imageURL').reset();
      this.itemGroup.get('imageFile').reset();
      // this.matDialogRef.close();
    } catch (error) {
      console.log(error);
      this.matSnackBar.open(error.error.message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async addAnswer(answer = '', isCorrect = false): Promise<void> {
    this.answers.push(new FormGroup({
      answer: new FormControl(answer, [Validators.required]),
      isCorrect: new FormControl(isCorrect)
    }));
  }

  async onRemoveAnswer(i: number): Promise<void> {
    this.answers.removeAt(i);
  }

  async onSelectImage(event): Promise<void> {
    const files: FileList = event.target.files;
    if (files.length > 0) {
      const photo = files.item(0);

      const fileReader = new FileReader();
      fileReader.onload = ev => {
        this.itemGroup.patchValue({
          imageURL: fileReader.result,
          imageFile: photo
        });
      };
      fileReader.readAsDataURL(photo);
    }
  }

  async onRemoveImage(): Promise<void> {
    this.itemGroup.patchValue({
      imageURL: '',
      imageFile: ''
    });
  }

}
