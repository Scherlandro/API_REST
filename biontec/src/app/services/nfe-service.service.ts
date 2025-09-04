import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NfeService {
  private apiUrl = 'http://localhost:8080/api/nfe';

  constructor(private http: HttpClient) { }

  processarNfe(idNfe: number, usuario: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/processar`, { idNfe, usuario });
  }

  processarLote(dataRef: Date, usuario: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/processar-lote`, { dataRef, usuario });
  }

  getNfesPendentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pendentes`);
  }

  calcularImposto(idNfe: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/calcular-imposto/${idNfe}`);
  }
}
