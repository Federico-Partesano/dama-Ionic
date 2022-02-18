import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { ModalAllUsersComponent } from 'src/app/components/modal-all-users/modal-all-users.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule
  ],
  declarations: [ChatsPage, ModalAllUsersComponent]
})
export class ChatsPageModule {}
