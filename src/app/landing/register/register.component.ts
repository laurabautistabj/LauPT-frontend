import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfirmField, PasswordValidator} from '../../util/custom.validators';
import {AngularFireAuth} from '@angular/fire/auth';
import {AngularFireStorage} from '@angular/fire/storage';
import {NavigationProvider} from '../../providers/navigation.provider';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import {Router} from "@angular/router";
import {StudentService} from "../../services/student.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent implements OnInit {

  imagePreview;
  private imageReader = new FileReader();

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    motherLastName: new FormControl('', []),
    dateOfBirth: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    address: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    profilePicture: new FormControl(''),
    password: new FormControl('', [Validators.required, PasswordValidator]),
    password_confirmation: new FormControl('', [Validators.required])
  }, ConfirmField('password'));

  constructor(private angularFireAuth: AngularFireAuth,
              private angularFireStorage: AngularFireStorage,
              private navigationProvider: NavigationProvider,
              private studentService: StudentService,
              private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.imageReader.onload = event => {
      this.imagePreview = event.target.result;
    };
  }

  async onRegister(): Promise<void> {
    const values = this.registerForm.value;
    this.navigationProvider.showLoader();
    try {
      const user = await this.angularFireAuth.createUserWithEmailAndPassword(values.email, values.password);
      if (this.imagePreview) {
        const imageRef = this.angularFireStorage.storage.ref('profilePicture')
          .child(`${user.user.uid}.jpg`);
        await imageRef.putString(this.imagePreview, firebase.default.storage.StringFormat.DATA_URL);
        await user.user.updateProfile({
          displayName: `${values.firstName} ${values.lastName} ${values.motherLastName}`,
          photoURL: await imageRef.getDownloadURL()
        });
      } else {
        await user.user.updateProfile({
          displayName: `${values.firstName} ${values.lastName} ${values.motherLastName}`
        });
      }

      try {
        await this.studentService.create({
          ApPaterno: values.lastName,
          ApMaterno: values.motherLastName,
          Direccion: values.address,
          Sexo: values.gender,
          Telefono: values.phone,
          Nombre: values.firstName
        });

        await this.router.navigateByUrl('/student');
      } catch (registerError) {
        console.log(registerError);
        await user.user.delete();
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.navigationProvider.hideLoader();
    }
  }

  async imageSelected(event): Promise<void> {
    const files: File[] = event.target.files;
    if (files.length === 0) {
      this.registerForm.get('profilePicture').reset();
      return;
    }
    this.registerForm.get('profilePicture').setValue(files[0]);
    this.imageReader.readAsDataURL(this.registerForm.get('profilePicture').value);
  }

}
