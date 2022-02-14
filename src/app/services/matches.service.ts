import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { pathApi } from 'src/config';
import { Match, Message, SetMove } from 'src/models/match';

@Injectable({
  providedIn: 'root'
})
export class MatchesService {

  constructor(private http: HttpClient) { }



  getMatches = () =>  this.http.get<Match[]>(`${pathApi}/matches/`).toPromise();

  getMatch = (id: string) =>  this.http.get<Match>(`${pathApi}/matches/${id}`).toPromise();
  joinMatch = (id: string) =>  this.http.post<Match>(`${pathApi}/matches/${id}/join`, {}).toPromise();


  addMatch = (nickname: string) =>  this.http.post<Match>(`${pathApi}/matches/`, {id: nickname}).toPromise();

  addMessage = (id: string, body: {nickname: string, content: string}) =>  this.http.post<Message>(`${pathApi}/matches/${id}/message`, body).toPromise();



  setMove = (id:string,body: SetMove) =>  this.http.post<Match>(`${pathApi}/matches/${id}/move`,body).toPromise();


}
