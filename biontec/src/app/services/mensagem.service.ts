import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private stompClient: any;
  private mensagemSubject = new Subject<string>();

  constructor(private http: HttpClient) {
    this.inicializarWebSocket();
  }

  private inicializarWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.Stomp.over(socket);
    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/mensagens', (mensagem: any) => {
        this.mensagemSubject.next(mensagem.body);
      });
    });
  }

  getMensagens(): Observable<string> {
    return this.mensagemSubject.asObservable();
  }

  buscarMensagensAntigas(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:8080/api/mensagens');
  }
}
