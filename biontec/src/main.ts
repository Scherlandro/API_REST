/*

import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

import { environment } from './environments/environment';
import { routes } from './app/app.routes'; 

// Importação de módulos legados ou de terceiros que ainda não são standalone
import { AppMaterialModule } from "./app/shared/app-material/app-material.module";
import { PublicModule } from "./app/public/public.module";

// Serviços e Interceptors
import { AuthService } from "./app/services/auth.service";
import { BaseService } from "./app/services/base.service";
import { TokenInterceptorProvider } from "./app/services/interceptors/token.interceptor";
*/

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

/*
bootstrapApplication(AppComponent, {
  providers: [
    // Configurações Globais
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()), // Habilita o uso de Interceptors baseados em classe

    // Serviços Globais
    AuthService,
    BaseService,
    TokenInterceptorProvider,

    // Se você ainda precisar importar módulos inteiros (como os do Angular Material ou Shared)
    importProvidersFrom(
      AppMaterialModule,
      PublicModule
    )
  ]
}).catch(err => console.error(err));*/
