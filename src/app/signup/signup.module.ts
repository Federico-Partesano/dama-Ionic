import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPageRoutingModule } from './signup-routing.module';

import { SignupPage } from './signup.page';
import { ModalSelectorImageComponent } from '../components/modal-selector-image/modal-selector-image.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignupPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [SignupPage, ModalSelectorImageComponent]
})
export class SignupPageModule {}
