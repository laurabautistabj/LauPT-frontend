import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body): Promise<any> {
    return this.httpClient.post(`${environment.server}/cursos`, body).toPromise();
  }

  async list(): Promise<any> {
    return this.httpClient.get(`${environment.server}/cursos`).toPromise();
  }

  async retrieve(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/cursos/${id}`).toPromise();
  }

  async listUnits(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/cursos/${id}/unidades`).toPromise();
  }

  async createUnit(id: string, body: any): Promise<any> {
    return this.httpClient.post(`${environment.server}/cursos/${id}/unidades`, body).toPromise();
  }

  async content(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/cursos/${id}/content`).toPromise();
  }

  async students(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/cursos/${id}/alumnos`).toPromise();
  }
}
