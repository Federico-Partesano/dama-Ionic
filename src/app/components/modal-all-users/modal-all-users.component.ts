import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { User } from 'src/models/user';

@Component({
  selector: 'app-modal-all-users',
  templateUrl: './modal-all-users.component.html',
  styleUrls: ['./modal-all-users.component.scss'],
})
export class ModalAllUsersComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() selectedUser: EventEmitter<User> = new EventEmitter();

  @Input() isOpen: boolean;
  users: User[]
  constructor(private chatsService: ChatService) { }

  async ngOnInit() {
    this.users = await this.chatsService.getUsers();
  }

  handleCloseModal(){
    console.log('click')
    this.closeModal.emit(false);
  }

  handleSelectedUser(user: User){

    this.selectedUser.emit(user);
  }


}
