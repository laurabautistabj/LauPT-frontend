import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardProfessorProvider {
  professorData = new BehaviorSubject<any>(null);
}
