import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class StudentLearningStyleService {

  constructor(private httpClient: HttpClient) {
  }

  async create(body: { Pregunta: string, Respuesta: string }[]): Promise<any> {
    return this.httpClient.post(`${environment.server}/estilo-aprendizaje-alumno`, body).toPromise();
  }

  async retrieve(): Promise<any> {
    return this.httpClient.get(`${environment.server}/estilo-aprendizaje-alumno`).toPromise();
  }
}
