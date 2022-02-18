import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { Chat } from 'src/models/Chat';
import { User } from 'src/models/user';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  users: Chat[];
  ismodalOpen: boolean = false;


  constructor(private chatService: ChatService, private auth: AuthService) { }

  async ngOnInit() {
    this.users = await this.chatService.getChats();
    console.log(await this.auth.getItemStorage('credentials'));
  }


  openModal = () => this.ismodalOpen = true;
  closeModal = () => this.ismodalOpen = false;



  emitted(user: User) {
    // add POST NEW CHAT
    this.ismodalOpen =   false;
  }

}
