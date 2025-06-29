import {CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import {AppMaterialModule} from "./shared/app-material/app-material.module";
import {SharedModule} from "./shared/shared.module";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./guards/auth.guard.ts";
import {BaseService} from "./services/base.service";
import { ErrorComponent } from './utils/error/error.component';
import { TokenInterceptorProvider} from "./services/interceptors/token.interceptor";
import {MatRippleModule} from "@angular/material/core";
import {PublicModule} from "./public/public.module";


@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent

  ],
    imports: [
        BrowserModule,
        AppRouting,
        HttpClientModule,
        BrowserAnimationsModule,
        AppMaterialModule,
        ReactiveFormsModule,
        FormsModule,
        MatSidenavModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressBarModule,
        MatRippleModule,
        PublicModule

    ],
  providers: [AuthService, AuthGuard, BaseService,TokenInterceptorProvider ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
