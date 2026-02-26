import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {iPagamento} from "../interfaces/pagamento";
import {Observable, of} from "rxjs";
import {environment} from "../../environments/environment";
import {EfiChargeRequest} from "../interfaces/efi-charge-request";

@Injectable({ providedIn: 'root' })
export class PagamentoService {

  private readonly baseUrl = environment.API_PATH + 'api/pagamentos';
  private readonly isLocal = true; //environment.isLocal;

  constructor(private http: HttpClient) {}

  //Enviando aqui para backend para processar com a Efí
  gerarCobrancaEfiViaPix(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/efi/pix`, dados);
  }

  salvar(pagamento: iPagamento): Observable<iPagamento> {
    return this.http.post<iPagamento>(`${this.baseUrl}/salvar`, pagamento);
  }

  buscarPorVenda(vendaId: number, tipoOrigem: string): Observable<iPagamento[]> {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/origem/${vendaId}?tipo=${tipoOrigem}`);
  }

  buscarPorOrigem(origemId: number, tipoOrigem: string) {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/origemId/${origemId}?tipoOrigem=${tipoOrigem}`);

  }

  getFechamento(dataConsulta: string): Observable<iPagamento[]> {
    return this.http.get<iPagamento[]>(`${this.baseUrl}/fechamento/${dataConsulta}`);

  }


  getFormasPagamento(termo: string): Observable<string[]> {
    const listaStatus = [
      'Dinheiro',
      'Pix',
      'Cartão em Débito',
      'Cartão em Crédito',
      'Boleto'
    ];
    const filtrados = listaStatus.filter(s =>
      s.toLowerCase().includes(termo.toLowerCase())
    );
    return of(filtrados); // Retorna como Observable
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


  buscarStatusNoBanco(idPagamento: any): Observable<any> {
     return this.http.get<iPagamento[]>(this.baseUrl);
  }
}
