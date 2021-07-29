import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UnitSubjectsService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad`, body).toPromise();
  }

  async update(id: string, body: any): Promise<any> {
    return this.httpClient.patch(`${environment.server}/tema-unidad/${id}`, body).toPromise();
  }

  async list(): Promise<any> {
    return this.httpClient.get(`${environment.server}/tema-unidad`).toPromise();
  }

  async retrieve(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/tema-unidad/${id}`).toPromise();
  }

  async listQuestions(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/tema-unidad/${id}/preguntas`).toPromise();
  }

  async createQuestion(id: string, body: any): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad/${id}/preguntas`, body).toPromise();
  }

  async deleteQuestion(id: string): Promise<any> {
    return this.httpClient.delete(`${environment.server}/tema-unidad/${id}/preguntas`).toPromise();
  }

  async initQuestionnaire(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/tema-unidad/${id}/questionnaire`).toPromise();
  }

  async notificationLevel(id: string, body:any): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad/${id}/notification`, body).toPromise();
  }

  async notificationLevelResource(id: string, body:any): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad/${id}/notificationResource`, body).toPromise();
  }

  async submitQuestionnaireAnswer(id: string, questionId: string, answerId: string, alumnoCursaId): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad/${id}/questionnaire`, {
      IdPregunta: questionId,
      IdRespuesta: answerId,
      AlumnoCursaId: alumnoCursaId
    }).toPromise();
  }

  async createResource(id: string, body: any): Promise<any> {
    return this.httpClient.post(`${environment.server}/tema-unidad/${id}/recursos`, body).toPromise();
  }

  async listResources(id: string): Promise<any> {
    return this.httpClient.get(`${environment.server}/tema-unidad/${id}/recursos`).toPromise();
  }

  async deleteResource(id: string): Promise<any> {
    return this.httpClient.delete(`${environment.server}/tema-unidad/${id}/recursos`).toPromise();
  }
}
