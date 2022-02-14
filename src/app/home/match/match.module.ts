import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';
import { MatchPage } from './match.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatchPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MatchPage]
})
export class MatchPageModule {}
