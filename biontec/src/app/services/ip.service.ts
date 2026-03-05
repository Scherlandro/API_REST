import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({ providedIn: 'root' })
export class IpService {
  private baseUrl: string = environment.API_PATH +'api/my-ip';

  constructor(private _http: HttpClient) { }


  getIpAddress(): Observable<{ ip: string }> {
    return this._http.get<{ ip: string }>(this.baseUrl);
  }
}
