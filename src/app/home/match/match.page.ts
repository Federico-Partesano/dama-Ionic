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
  classClick1 = '';
  classClick2 = '';
  currentPlayer: number[];
  choics: `${string}-${string}`[] = [];
  rotated: boolean;

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
    this.rotationField = "player__1";
  } else {
    this.rotationField = "player__2"
  }
  if(this.match.player1 !== this.nickname){
    this.currentPlayer = [1,2];
    this.rotated = false
  } else {
    this.currentPlayer = [3,4];
    this.rotated = true;
  }
  console.log()
}

   handleClick = async(x: number, y: number) => {
     if(this.match.currentPlayer !== this.nickname) return this.toastService.presentToast('Await your turn!!');
    console.log(`${x}-${y}`);
    if (!this.click1){  
      console.log('llll',this.match.field[x][y]);
      if(!this.currentPlayer.includes(this.match.field[x][y])) return
      this.click1 = {startX: x,startY: y}
      this.classClick1 = `${x}-${y}`;
      this.tt(x,y);
      return;
    }
    if (!this.click2) {
      if(this.click1.startX === x && this.click1.startY === y ){
        this.click1 = null;
        this.classClick1 = '';
        this.choics = [];
        console.log('click');
        return
      }
      if(!this.tt4(x,y)) {
         this.click1 = null;
        this.choics = [];
        this.classClick1 = '';
        return
      }
      this.click2 = {finalX:x,finalY:y};
      try{
      this.match = await this.matchService.setMove(this.path, {...this.click1, ...this.click2});
      this.click1 = null;
      this.click2 = null;
      this.classClick1 = ``;
      this.choics = [];


      } catch({error: {error}}) {
        console.log(error);
        this.toastService.presentToast(error);
        this.click1 = null;
        this.click2 = null;
        this.classClick1 = ``;
        this.choics = [];

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

  convertToString = (number1: number, number2: number) => `${number1}-${number2}`;

  tt = (y: number, x: number) => {
    if(this.rotated){
      this.match.field[y-1][x-1] === 0 &&  this.choics.push(`${y - 1}-${x - 1}`);
      this.match.field[y-1][x+1] === 0 &&  this.choics.push(`${y - 1}-${x + 1}`);
    } else {
      
      this.match.field[y+1][x-1] === 0 &&  this.choics.push(`${y + 1}-${x - 1}`);
      this.match.field[y+1][x+1] === 0 &&  this.choics.push(`${y + 1}-${x + 1}`);
    }
  }


  tt4 = (x: number, y: number): boolean =>  this.choics.some((element) => element == `${x}-${y}`);

  checkDiagonal = (y: number, x: number) => {
    if(this.match.field[y][x]) {

    }
  }
  
}
