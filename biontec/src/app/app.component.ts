import {Component, Input} from '@angular/core';
import {AuthService} from "./services/auth.service";
import { NotificationMgsService } from './services/notification-mgs.service';
import {TokenService} from "./services/token.service";
import {ITokenUser} from "./interfaces/user";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'biontec';
  message = ''
  display = false
  user!: ITokenUser;
  mostrarMenu: boolean = false;

  @Input() deviceXs!: boolean;
  topVal = 0;

  constructor(private authService: AuthService,
              private apiErrorService: NotificationMgsService,
              private tokenService: TokenService
              ) {

  }

  ngOnInit(){
    this.authService.mostrarMenuEmitter.subscribe(
      mostrar => this.mostrarMenu = mostrar
    );
    this.apiErrorService.apiError.subscribe(
      data => {
        this.message = data
        this.display = true
      }
    );
  }

  logout(){
    this.authService.logout();
  }

  clearMessage(){
    this.message = ''
    this.display = false
  }

  onScroll(e:any) {
    let scrollXs = this.deviceXs ? 55 : 73;
    if (e.srcElement.scrollTop < scrollXs) {
      this.topVal = e.srcElement.scrollTop;
    } else {
      this.topVal = scrollXs;
    }
  }

  sideBarScroll() {
    let e = this.deviceXs ? 160 : 130;
    return e - this.topVal;
  }


}

/*
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Componentes
import { ErrorComponent } from './utils/error/error.component';

// Material (Opcional: você pode importar um a um para melhor Tree Shaking)
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatRippleModule } from "@angular/material/core";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ErrorComponent, // Importado diretamente aqui
    MatSidenavModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppComponent { }
 */
