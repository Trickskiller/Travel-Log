import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { AccueilComponent } from './accueil/accueil.component';
import { AddObjectComponent } from './add-object/add-object.component';
import { ProfileComponent } from './profile/profile.component';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { DetailsComponent } from './details/details.component';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { EditTripComponent } from './edit-trip/edit-trip.component';
import { RadioButtonModule } from 'primeng/radiobutton';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AvatarModule,
    AvatarGroupModule,
    IonicModule,
    HomePageRoutingModule,
    BadgeModule,
    TagModule,
    DialogModule,
    ReactiveFormsModule,
    FormsModule,
    ProgressBarModule,
    DataViewModule,
    SelectButtonModule,
    ScrollPanelModule,
    FieldsetModule,
    ButtonModule,
    RadioButtonModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage, AccueilComponent, AddObjectComponent, ProfileComponent, DetailsComponent,EditTripComponent]
})
export class HomePageModule {}
