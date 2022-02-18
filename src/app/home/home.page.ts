import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Credentials } from 'src/models/credentials';
import { Match } from 'src/models/match';
import { AuthService } from '../services/auth.service';
import { MatchesService } from '../services/matches.service';
import { ToastService } from '../services/toast.service';
import { Animation, AnimationController, createAnimation } from '@ionic/angular';
import * as io from 'socket.io-client';
import { pathSocket } from 'src/config';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  nickname: string = '';
  matches: Match[] = [];
  isModalOpen: boolean = true;

  constructor(private auth: AuthService,
    private router: Router,
    private matchService: MatchesService,
    private routerActive:ActivatedRoute,
    private toastService: ToastService,
    private animationCtrl: AnimationController
  ) {
  }

  async ngOnInit() {

    this.auth.socket.on('match-join', (match: Match) => {
      const item = this.matches.find(element => element.id === match.id);
     item.field = match.field;
     item.player2 = match.player2;
     item.status = match.status;
     item.currentPlayer = match.currentPlayer;
      console.log('ciao', match);
 

  this.auth.socket.on('match-setmove', (match: Match) => {
    const item = this.matches.find(element => element.id === match.id);
    item.field = match.field;
    item.player2 = match.player2;
    item.status = match.status;
    item.currentPlayer = match.currentPlayer;
   })
})


  
  this.auth.socket.on('add-new-match', (match: Match) => {
      console.log('refresh', match)
    this.matches.unshift(match)
  })

  this.auth.socket.on('matches', (matches: Match[]) => {
    console.log('refresh2222', matches)
  this.matches = matches;
})    
    this.matches = await this.matchService.getMatches();
    this.nickname = await (await this.auth.getItemStorage<Credentials>('credentials')).nickname;
    console.log(this.matches);
  }

  logout = async() => {
    await this.auth.setItemStorage('credentials', undefined);
    this.router.navigate(['/login']);
  }

   redirectToMatch = async(id: string, player2: string) => {
     if(player2) return this.router.navigate([`${id}`,'match'], {relativeTo: this.routerActive});

    try {
      await this.matchService.joinMatch(id)
     this.router.navigate([`${id}`,'match'], {relativeTo: this.routerActive});
    } catch({error: {error}}) {
      console.log(error);
      this.toastService.presentToast(error);
    }
  }

  addNewMatch = async () => {
    try{  
     await this.matchService.addMatch(this.nickname);
    //  this.matches.unshift(newMatch);
    }catch(e) {
      console.log(e);
      // this.toastService.presentToast(error);
    }
}

  socketEvent = () => {
    this.auth.socket.emit('hello','asdasd');
    console.log('prova');
}

}
