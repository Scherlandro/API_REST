import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as Stomp from '@stomp/stompjs';
//import * as SockJS from 'sockjs-client';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private baseUrl: string = environment.API_PATH +'api/mensagens';
  private stompClient: any;
  private mensagemSubject = new Subject<string>();

  constructor(private _http: HttpClient) {  }


  public inicializarWebSocket(): Observable<string[]> {
   // const socket = new SockJS(this.baseUrl);
    //this.stompClient = Stomp.Stomp.over(socket);
   return  this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topicos', (mensagem: any) => {
        this.mensagemSubject.next(mensagem.body);
      });
    });
  }

  getMensagens(): Observable<string> {
    return this.mensagemSubject.asObservable();
  }

  public getNotification0(): Observable<string> {
    console.log('Conteúdo da notificação', this._http.get<string>(this.baseUrl+'/notification')
      .pipe(map(response => response)))
     return this._http.get<string>(this.baseUrl+'/notification')
      .pipe(map(response => response));
    }


  public getNotification(): Observable<string> {
    console.log('Notificação ->', this._http.get(this.baseUrl+'/notification'))
    return  this._http.get(this.baseUrl+'/notification')
      .pipe(map(response => response));
  }

}
