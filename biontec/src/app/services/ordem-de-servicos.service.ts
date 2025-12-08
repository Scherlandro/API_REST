import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
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
    return this.http.post<iServiceOrder>(this.baseUrl, order);
  }

  update( order: iServiceOrder): Observable<iServiceOrder> {
    console.log('Valor OS Atualizada', order);
    return this.http.put<iServiceOrder>(this.baseUrl, order);
  }

  search(params: any): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.baseUrl + '/search', { params });
  }
}
