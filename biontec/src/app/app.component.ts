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

  //  this.user = this.tokenService.getPayload()

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
