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



    
  this.auth.socket.on('add-new-match', (match: Match) => {
      console.log('refresh', match)
    this.matches.unshift(match)
  })

  this.auth.socket.on('matches', (matches: Match[]) => {
    console.log('refresh2222', matches)
  this.matches = matches;
})

//   this.socket.emit('event1', {
//     msg: 'Client to server, can you hear me server?'
// });
//   this.socket.on('event2', (data: any) => {
//   console.log(data.msg);
//   this.socket.emit('event3', {
//       msg: 'Yes, its working for me!!'
//   });
// });
   
    
    this.matches = await this.matchService.getMatches();
    this.nickname = await (await this.auth.getItemStorage<Credentials>('credentials')).nickname;
    console.log(this.matches);
  }

  logout = async() => {
    await this.auth.setItemStorage('credentials', undefined);
    this.router.navigate(['/login']);
  }

   redirectToMatch = async(id: string) => {
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
     const newMatch = await this.matchService.addMatch(this.nickname);
     this.matches.unshift(newMatch);
    }catch({error:{error}}) {
      this.toastService.presentToast(error);
    }
}

  socketEvent = () => {
    this.auth.socket.emit('hello','asdasd');
    console.log('prova');
}

}
