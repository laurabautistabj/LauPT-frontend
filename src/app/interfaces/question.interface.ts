import {AnswerInterface} from "./answer.interface";

export interface QuestionInterface {
  Id: string;
  Multiple: boolean;
  Pregunta: string;
  Imagen?: string;
  Respuestas: AnswerInterface[];
  AlumnoCursaId?: string;
  Resultado?: any;
}
