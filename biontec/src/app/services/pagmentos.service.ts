import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Pagamento} from "../interfaces/pagamento";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PagamentoService {

  private readonly baseUrl = environment.API_PATH + 'api/pagamentos/';
  private readonly isLocal = true; //environment.isLocal;

  constructor(private http: HttpClient) {}

  salvar(pagamento: Pagamento): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.baseUrl}/salvar`, pagamento);
  }

  buscarPorVenda(vendaId: number): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.baseUrl}/origem/${vendaId}?tipo=VENDA`);
  }

  buscarPorOrigem(origemId: number, tipoOrigem: string) {
    return this.http.get<Pagamento[]>(`${this.baseUrl}/origem/${origemId}?tipo=VENDA`);

  }

  getFechamento(dataConsulta: string): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.baseUrl}/fechamento/${dataConsulta}`);

  }
}
