import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home/home.component';
import {ContactComponent} from './contact/contact.component';
import {PublicRoutingModule} from './public-routing.module';
import {PlayoutComponent} from './playout/playout.component';
import {PheaderComponent} from './pheader/pheader.component';
import {AppMaterialModule} from "../shared/app-material/app-material.module";
import {ProductsPComponent} from "./products/products-p";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DistrictComponent } from './district/district.component';
import { PrevDirective } from './district/prev.directive';
import { NextDirective } from './district/next.directive';

@NgModule({
  declarations: [
    HomeComponent,
    ProductsPComponent,
    ContactComponent,
    PlayoutComponent,
    PheaderComponent,
    DistrictComponent,
    PrevDirective,
    NextDirective
  ],
  exports: [
    PlayoutComponent,
    PheaderComponent
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
    AppMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class PublicModule {
}
