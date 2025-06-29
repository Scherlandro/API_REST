import {Component, OnInit, ViewEncapsulation} from '@angular/core';
// import Swiper core and required modules
import Swiper from "swiper";
import {getTemplateId} from "@angular/compiler-cli/src/ngtsc/typecheck/diagnostics";
import {NgForm} from "@angular/forms";
import {HttpClient, HttpHeaders} from "@angular/common/http";
// install Swiper modules
//SwiperCore.use([EffectCube, Pagination]);

@Component({
  selector: 'app-playout',
  templateUrl: './playout.component.html',
  styleUrls:['./playout.component.css','playout.component.scss'],
  encapsulation:ViewEncapsulation.None,
})
export class PlayoutComponent implements OnInit {
  irpara: boolean = true;

  constructor(private _http: HttpClient) { }

  ngOnInit(): void {
  //  this.mySwiper();
  }
//   https://stackoverflow.com/questions/54849756/how-to-send-email-using-angular-7
  onSubmit(contactForm: NgForm) {
    if (contactForm.valid) {
      const email = contactForm.value;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      this._http.post('https://formspree.io/asdlf7asdf',
        { name: email.name, replyto: email.email, message: email.messages },
        { 'headers': headers }).subscribe(
        response => {
          console.log(response);
        }
      );
    }
  }


/*
  mySwiper() {
    return new Swiper('formSwiper', {
      effect: "cube",
      grabCursor: true,
      cubeEffect: {
        shadow: true,
        slideShadows: true,
        shadowOffset: 20,
        shadowScale: 0.94
      },
      pagination: {el: '.formSwiper'},
      autoplay: true,
    });
  }
*/


}
