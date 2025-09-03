import { Component, OnInit } from '@angular/core';
import { ITokenUser } from 'src/app/interfaces/user';
import { TokenService } from 'src/app/services/token.service';
import {AuthService} from "src/app/services/auth.service";

@Component({
  selector: 'app-aheader',
  templateUrl: './aheader.component.html',
  styleUrls: ['./aheader.component.css']
})
export class AheaderComponent implements OnInit {
  mostrarMenuHeader: boolean = false;
  nameDoUsuario: string = '';
  user: ITokenUser = {
    id: 0,
    name: '',
    username: ''
  }
  constructor(private tokenService: TokenService
              ) { }

  ngOnInit(): void {
    this.user = this.tokenService.getPayload();
  }

  logout(): void{
    this.tokenService.clearToken()
  }

}
