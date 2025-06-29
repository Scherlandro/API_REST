import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { ITokenUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private router: Router) { }

  saveToken(token: string): void{
    localStorage.setItem('token', token)
    this.router.navigate(['admin'])
  }

  isLogged(): boolean{
    const token = localStorage.getItem('token')
    return !! token
  }

  clearToken(): void{
    localStorage.removeItem('token')
    this.router.navigate(['/'])
  }

  clearTokenExpired(): void{
    //  https://stackoverflow.com/questions/60758154/how-to-check-if-jwt-token-is-expired-in-angular-8
    localStorage.removeItem('token')
    this.router.navigate(['auth'])
  }

  getToken(): string | null{
    return localStorage.getItem('token')
  }

  getPayload(){
    let user: ITokenUser = {
      id: 0,
      name: '',
      username: ''
    }
    let token = localStorage.getItem('token')
    if(token != null){
      const decode: ITokenUser =  jwtDecode<ITokenUser>(token)
      user.id = decode.id
      user.name = decode.name
      user.username = decode.username
    }

    return user

  }
}
