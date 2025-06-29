import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {iServiceOrder} from "../interfaces/service-order";

@Injectable({ providedIn: 'root' })
export class OrdemDeServicosService {
  private apiUrl = '/api/service-orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.apiUrl);
  }

  getById(id: number): Observable<iServiceOrder> {
    return this.http.get<iServiceOrder>(`${this.apiUrl}/${id}`);
  }

  create(order: iServiceOrder): Observable<iServiceOrder> {
    return this.http.post<iServiceOrder>(this.apiUrl, order);
  }

  update(id: number, order: iServiceOrder): Observable<iServiceOrder> {
    return this.http.put<iServiceOrder>(`${this.apiUrl}/${id}`, order);
  }

  search(params: any): Observable<iServiceOrder[]> {
    return this.http.get<iServiceOrder[]>(this.apiUrl + '/search', { params });
  }
}
