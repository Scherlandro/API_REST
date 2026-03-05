import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class IpService {
  private apiUrl = 'http://localhost:8080/api/my-ip';

  constructor(private http: HttpClient) {}

  getIpAddress(): Observable<{ ip: string }> {
    return this.http.get<{ ip: string }>(this.apiUrl);
  }
}
