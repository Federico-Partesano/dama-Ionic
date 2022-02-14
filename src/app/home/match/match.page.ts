import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatchesService } from 'src/app/services/matches.service';
import { ToastService } from 'src/app/services/toast.service';
import { Credentials } from 'src/models/credentials';
import { Match, Message } from 'src/models/match';

@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {
  @ViewChild('target') private myScrollContainer: ElementRef;
  path: string;
  match: Match;
  prova: string = "ss";
  click1: Record<'startX' | 'startY', number>
  click2: Record<'finalX' | 'finalY', number>
  rotationField: string = '';
  nickname: string = '';
  interval: any;
  inputChat = new FormControl('');

  constructor(private auth: AuthService, private router: Router, private matchService: MatchesService,private routerActive:ActivatedRoute, private toastService: ToastService) {
    this.path = this.routerActive.snapshot.paramMap.get('id');
  }


  async ngOnInit() {


    this.auth.socket.on(`add-new-message-${this.path}`, (message: Message) => {
      this.match.messages.push(message);
      this.scrollToElement();

    })

    this.auth.socket.on(`match-refresh-${this.path}`, (match: Match) => {
      console.log('refresh', match);
      this.match = match;

    })
 
    this.nickname =  (await this.auth.getItemStorage<Credentials>("credentials")).nickname;
    console.log((await this.auth.getItemStorage<Credentials>("credentials")).nickname)
    this.match = await this.matchService.getMatch(this.path);
    if(this.match.player1 === this.nickname){
    this.rotationField = "player__1"
  } else {
    this.rotationField = "player__2"
  }
}

   handleClick = async(x: number, y: number) => {
    console.log(`${x}-${y}`)
    if (!this.click1) return this.click1 = {startX: x,startY: y}
    if (!this.click2) {
      this.click2 = {finalX:x,finalY:y};
      try{
      this.match = await this.matchService.setMove(this.path, {...this.click1, ...this.click2});
      this.click1 = null;
      this.click2 = null;

      } catch({error: {error}}) {
        console.log(error);
        this.toastService.presentToast(error);
        this.click1 = null;
        this.click2 = null;
      }
    }

  }

  scrollToElement(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      behavior: 'smooth'
    });
  }


   addMessage = async() => {
     try{
       if(this.inputChat){
        this.matchService.addMessage(this.path, {nickname: this.nickname,content: this.inputChat.value});
        this.inputChat.setValue('');
      }
       } catch({error: {error}}){
        this.toastService.presentToast(error);
      }
  }
}
