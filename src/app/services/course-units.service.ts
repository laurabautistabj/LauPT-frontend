import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseUnitsService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body): Promise<any> {
    return this.httpClient.post(`${environment.server}/unidad-curso`, body).toPromise();
  }

  async list(): Promise<any> {
    return this.httpClient.get(`${environment.server}/unidad-curso`).toPromise();
  }

  async retrieve(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/unidad-curso/${id}`).toPromise();
  }

  async listSubjects(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/unidad-curso/${id}/temas`).toPromise();
  }

  async createSubject(id: string, body: any): Promise<any> {
    return this.httpClient.post(`${environment.server}/unidad-curso/${id}/temas`, body).toPromise();
  }
}
