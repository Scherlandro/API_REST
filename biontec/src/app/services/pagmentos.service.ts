import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {iPagamento} from "../interfaces/pagamento";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class PagamentoService {

  private readonly baseUrl = environment.API_PATH + 'api/pagamentos/';
  private readonly isLocal = true; //environment.isLocal;

  constructor(private http: HttpClient) {}

  salvar(pagamento: iPagamento): Observable<iPagamento> {
    return this.http.post<iPagamento>(`${this.baseUrl}/salvar`, pagamento);
  }

  buscarPorVenda(vendaId: number): Observable<iPagamento[]> {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/origem/${vendaId}?tipo=VENDA`);
  }

  buscarPorOrigem(origemId: number, tipoOrigem: string) {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/origem/${origemId}?tipo=VENDA`);

  }

  getFechamento(dataConsulta: string): Observable<iPagamento[]> {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/fechamento/${dataConsulta}`);

  }


  getStatus(termo: string): Observable<string[]> {
    const listaStatus = [
      'Aberta',
      'Fechada',
      'Parcelada',
      'Pendente'
    ];
    const filtrados = listaStatus.filter(s =>
      s.toLowerCase().includes(termo.toLowerCase())
    );
    return of(filtrados); // Retorna como Observable
  }
}
