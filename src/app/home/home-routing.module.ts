import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { AccueilComponent } from './accueil/accueil.component';
import { ProfileComponent } from './profile/profile.component';
import { AddObjectComponent } from './add-object/add-object.component';
import { DetailsComponent } from './details/details.component';
import { EditTripComponent } from './edit-trip/edit-trip.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:[
      {path: 'home', component: AccueilComponent},
      {path: 'add', component: AddObjectComponent},
      {path: 'profile', component: ProfileComponent},
      {path: 'details/:id', component: DetailsComponent},
      {path: 'edit/:id', component: EditTripComponent},

      {path: "", redirectTo: 'home', pathMatch: "full"},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
