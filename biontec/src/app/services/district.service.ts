import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DistrictService {

  constructor( private _http: HttpClient ) {
  }
//quebrandoumgalho: Senha*321;
  topNews = 'https://newsdata.io/api/1/news?apikey=pub_2840484097b9af883c43f609021c69378c2bb';

  topHeadlines():Observable<any>{
    return this._http.get(this.topNews);
  }


}
