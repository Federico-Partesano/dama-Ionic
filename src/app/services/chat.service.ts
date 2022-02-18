import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pathApi } from 'src/config';
import { Chat } from 'src/models/Chat';
import { User } from 'src/models/user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getUsers = () => this.http.get<User[]>(`${pathApi}/users`).toPromise();
  getChats = () => this.http.get<Chat[]>(`${pathApi}/chats`).toPromise();

}
