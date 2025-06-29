import { Injectable } from '@angular/core';
import {HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  url
  constructor(public postfixUrl:String) {
    this.url = environment.API_PATH+'api/'+postfixUrl
  }

  setUpHeaders() {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json' })
    //  headers = new HttpHeaders({ 'Content-Type': 'application/x-www-urlencoded','No-Auth':'True' })
    }
  }
}

