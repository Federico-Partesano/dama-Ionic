import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { pathApi, pathSocket } from 'src/config';
import { Storage } from '@ionic/storage-angular';
import { queryFilters } from 'src/utils/functions';
import  {connect, Socket} from 'socket.io-client';
import { WebSocketServer } from '@awesome-cordova-plugins/web-socket-server';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage: Storage = null;
  socket: Socket;

  constructor(private http: HttpClient, private storageService: Storage) { }

  connectSocket = () =>     !this.socket && (this.socket = connect(pathSocket));

  getSocket = () => this.socket;

  login = (body: Record<'nickname' | 'password', string>) =>  this.http.post<{accessToken: string}>(`${pathApi}/users/login`, body).toPromise();
  signup = (body: Record<'nickname' | 'password', string>) =>  this.http.post<{accessToken: string}>(`${pathApi}/users/signup`, body).toPromise();


  createStorage = async() => this.storage = await this.storageService.create();
  getItemStorage = async <T>(key: 'credentials'):Promise<T> => this.storage.get(key);
  setItemStorage = async (key: 'credentials', value: any) => this.storage.set(key, value);
  clearStorage = async () => this.storage.clear();

  public set(key: string, value: any) {
    this.storage?.set(key, value);
  }

//   /feeds GET
// /feeds POST { message, imgUrl } auth: true
// /feeds/:id/comments POST { message } auth: true
// /feeds/:id/like POST { like: boolean } auth: true

// /signup POST (nickname, password }
// /login  POST (nickname, password } -> Bearer BEARER_ID


}
