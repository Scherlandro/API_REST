import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { PlayoutComponent } from './playout/playout.component';
import {ProductsPComponent} from "./products/products-p";
import {DistrictComponent} from "./district/district.component";

const routes: Routes = [
  {
    path: '', component: PlayoutComponent, children: [
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      { path: '', component: HomeComponent },
      { path: 'products-p', component: ProductsPComponent },
      { path: 'contact', component: ContactComponent },
      {path: 'district', component: DistrictComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
