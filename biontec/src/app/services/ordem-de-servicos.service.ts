import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {Injectable} from "@angular/core";
import {iServiceOrder} from "../interfaces/service-order";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class OrdemDeServicosService {

  private baseUrl: string = environment.API_PATH +'api/service-orders';
  constructor(private http: HttpClient) {}

  getAll(): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.baseUrl);
  }

  getById(id: number): Observable<iServiceOrder> {
    return this.http.get<iServiceOrder>(`${this.baseUrl}/findOSById/${id}`);
  }

  create(order: iServiceOrder): Observable<iServiceOrder> {
    console.log('Criando os', order);
    return this.http.post<iServiceOrder>(this.baseUrl, order);
  }

  update( order: iServiceOrder): Observable<iServiceOrder> {
    return this.http.put<iServiceOrder>(this.baseUrl, order);
  }

  search(params: any): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.baseUrl + '/search', { params });
  }

  delete(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/delete/${id}`);
  }
// No seu Service
  getStatus(termo: string): Observable<string[]> {
    const listaStatus = [
      'OS em Andamento',
      'OS Autorizada Aberta',
      'OS Autorizada Fechada',
      'OS Não Autorizada Aberta',
      'OS Não Autorizada Fechada'
    ];

    // Filtra a lista localmente com base no que o usuário digitou
    const filtrados = listaStatus.filter(s =>
      s.toLowerCase().includes(termo.toLowerCase())
    );

    return of(filtrados); // Retorna como Observable
  }
}
