import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {IDataUser, ISingleUser, IUser} from '../interfaces/user';
import {environment} from "../../environments/environment";
import {delay, first, map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = environment.API_PATH + 'api/user';

  constructor(private _http: HttpClient) { }

  getAllUsers(): Observable<IUser[]>{
    return this._http.get<IUser[]>(this.baseUrl+'/all')
  }

  getUsers(){
    let list: IUser[]=[];
    return this._http.get(this.baseUrl+'/all')
      .toPromise().then(res => list = res as IUser[]);
  }


  getUser(uid: string ): Observable<IUser[]>{
    return this._http.get<IUser[]>(this.baseUrl+'/'+uid)
  }

  findByID(id: string): Observable<IUser[]> {
    return this._http.get<IUser[]>(this.baseUrl + id)
      .pipe(map((res:IUser[])=> res));
  }

  getUserByID(id:string){
    return this._http.get<IUser[]>(this.baseUrl + id)
      .pipe(
        first(),
        delay(2000),
        // https://www.youtube.com/watch?v=gi0ZJ8-r6IM
        tap(DebugarUser => console.log(DebugarUser))
      );
  }

  editarUsuario(user: IUser): Observable<IUser> {
    return this._http.put<IUser>(this.baseUrl+'/edit-user',user);
  }

  createUsuario(user: IUser): Observable<IUser> {
    return this._http.post<IUser>(this.baseUrl+'/save-user/',user);
  }

  deleteUsuario(user: IUser): Observable<IUser> {
    return this._http.delete<IUser>(this.baseUrl +'/delete-user/'+ user.id_usuario);
  }


}
