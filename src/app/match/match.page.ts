import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatchesService } from 'src/app/services/matches.service';
import { ToastService } from 'src/app/services/toast.service';
import { Credentials } from 'src/models/credentials';
import { Match, Message, SetMove } from 'src/models/match';
import { Animation, AnimationController } from '@ionic/angular';

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
  rotationField: 'player__1' | 'player__2';
  nickname: string = '';
  interval: any;
  inputChat = new FormControl('');
  classClick1:`${number}-${number}` | '' = '';
  classClick2 = '';
  currentPlayer: number[];
  choics: `${string}-${string}`[] = [];
  rotated: boolean;
  mustEat:boolean = false;
  constructor(private auth: AuthService, 
              private router: Router, 
              private matchService: MatchesService,
              private routerActive:ActivatedRoute, 
              private toastService: ToastService,
              private animationCtrl: AnimationController
              ) 
    {
    this.path = this.routerActive.snapshot.paramMap.get('id');
  }


  async ngOnInit() {
 
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

  

    this.auth.socket.on(`add-new-message-${this.path}`, (message: Message) => {
      this.match.messages.push(message);
      this.scrollToElement();

    })

    this.auth.socket.on(`match-refresh-${this.path}`,async ({match, moves: {startX,startY, finalX, finalY}}: {match: Match, moves: SetMove}) => {
      console.log('match', match)
      const animation = this.animationCtrl.create()
      .addElement(document.getElementById(startX + '-' + startY))
      .duration(500)
      .iterations(1)
      .easing('ease-out')
      .fromTo('left', `calc((90vw / 8) * ${this.rotationField === "player__1" ?  startY : startY} )`, `calc((90vw / 8) * ${this.rotationField === "player__1" ?  finalY : finalY} )`)
      .fromTo('top', `calc((90vw / 8) * ${this.rotationField === "player__1" ?  startX : startX} )`, `calc((90vw / 8) * ${this.rotationField === "player__1" ?  finalX : finalX} )`)
        await animation.play();
      console.log('refresh', match);
      this.match = match;
      this.checkDiagonal2();
      console.log('choice', this.choics);
      // this.checkDiagonal2(this.match);
    })


  console.log()
    setTimeout(() => {
      this.scrollToElement();
    }, 1000)
}


   handleClick = async(x: number, y: number) => {
     console.log('andleClick');
    if(this.nickname !== this.match.player1 && this.nickname !== this.match.player2) return
     if(this.match.currentPlayer !== this.nickname) return this.toastService.presentToast('Await your turn!!');
    console.log(`${x}-${y}`);

    if (!this.click1){  

  


      console.log('llll',this.match.field[x][y]);
      if(!this.currentPlayer.includes(this.match.field[x][y])) return
      this.click1 = {startX: x,startY: y}
      this.classClick1 = `${x}-${y}`;
      this.checkDiagonal(x,y);
       !this.choics.length && this.checkChoice(x,y);
      return;
    }
    if (!this.click2) {
      if(this.click1.startX === x && this.click1.startY === y && !this.mustEat ){
        this.click1 = null;
        this.classClick1 = '';
        this.choics = [];
        console.log('click');
        return
      }
      if(!this.tt4(x,y) && !this.mustEat) {
         this.click1 = null;
        this.choics = [];
        this.classClick1 = '';
        return
      }
      this.click2 = {finalX:x,finalY:y};
      try{
      const newMatch = await this.matchService.setMove(this.path, {...this.click1, ...this.click2});
      const {startX, startY} = this.click1;
      const {finalX, finalY} = this.click2;
    
      this.rotationField === "player__1" && console.log('sdasdasdasda');
      const animation = this.animationCtrl.create()
      .addElement(document.getElementById(startX + '-' + startY))
      .duration(500)
      .iterations(1)  
      .easing('ease-out')      
      .fromTo('left', `calc((90vw / 8) * ${this.rotationField === "player__1" ?  startY : startY} )`, `calc((90vw / 8) * ${this.rotationField === "player__1" ?  finalY : finalY} )`)
      .fromTo('top', `calc((90vw / 8) * ${this.rotationField === "player__1" ?  startX : startX} )`, `calc((90vw / 8) * ${this.rotationField === "player__1" ?  finalX : finalX} )`)
        await animation.play();
      console.log('animation');
        this.match = newMatch;
      this.click1 = null;
      this.click2 = null;
      this.classClick1 = ``;
      this.choics = [];
        this.mustEat = false;



      


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

   s = (x: number) =>  7-x
  
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

  checkChoice = (y: number, x: number) => {
    if(this.rotated){
      this.match.field[y-1][x-1] === 0 &&  this.choics.push(`${y - 1}-${x - 1}`);
      this.match.field[y-1][x+1] === 0 &&  this.choics.push(`${y - 1}-${x + 1}`);
      
    } else {
      
      this.match.field[y+1][x-1] === 0 &&  this.choics.push(`${y + 1}-${x - 1}`);
      this.match.field[y+1][x+1] === 0 &&  this.choics.push(`${y + 1}-${x + 1}`);
    }
  }


  checkDiagonal2 = () => {
    console.log('maust', this.mustEat)
    let coords:{x: number, y: number} | null= null;
    this.match.field.forEach((element, index) => {
        element.forEach((row, index2) => {
          if(this.mustEat) return
          if(this.currentPlayer.includes(row)) {
            console.log('row',row, "-");
            const coordsDiagonal = this.checkDiagonalRefresh(index, index2);
            coords = coordsDiagonal;
          if(this.choics.length > 0 && coords)
          { 
            const {x,y} = coords;
            this.classClick1 = `${y}-${x}`;
            this.click1 = {startX: y, startY: x}; 
            console.log('click1', coords);
            this.mustEat = true;
            return
          }
        }

        })
    });
  }


  tt4 = (x: number, y: number): boolean =>  this.choics.some((element) => element == `${x}-${y}`);

  checkDiagonal = (y: number, x: number):{y,x} => {
    console.log('t',x,y);
    if(this.rotated ){
     if((y > 0 && x > 0) && (this.match.field[y-1][x-1] === 1 || this.match.field[y-1][x-1] === 2)){
        if(( y >= 2 && x > 1) && this.match.field[y-2][x-2] === 0){
          this.choics.push(`${y - 2}-${x - 2}`);
        }
      }
      if( (y > 0 && x < 7) && (this.match.field[y-1][x+1] === 1 || this.match.field[y-1][x+1] === 2)){
        if((y > 1 && x < 6) && this.match.field[y-2][x + 2] === 0) {
          this.choics.push(`${y - 2}-${x + 2}`);
        }
      }
  
      // this.match.field[y-1][x+1] === 0 &&  this.choics.push(`${y - 1}-${x + 1}`);
    } else {

      if( (y < 7 && x > 0 )  && (this.match.field[y+1][x-1] === 3 || this.match.field[y+1][x-1] === 4)){
        if((x > 1 && y < 6) &&this.match.field[y+2][x-2] === 0){
          this.choics.push(`${y + 2}-${x - 2}`);
        }
      }
      if( (y < 7 && x < 7 ) && (this.match.field[y+1][x+1] === 3 || this.match.field[y+1][x+1] === 4)){

        if(( y < 6 && x < 6  ) &&this.match.field[y+2][x + 2] === 0) {
          this.choics.push(`${y + 2}-${x + 2}`);

        }
     } 
  }
  return {y,x};
}

checkDiagonalRefresh = (y: number, x: number):{y,x} => {
  console.log('t',x,y);
  if(this.rotated ){
   if((y > 0 && x > 0) && (this.match.field[y-1][x-1] === 1 || this.match.field[y-1][x-1] === 2)){
      if(( y >= 2 && x > 1) && this.match.field[y-2][x-2] === 0){
        this.choics.push(`${y - 2}-${x - 2}`);
      }
    }
    if( (y > 0 && x < 7) && (this.match.field[y-1][x+1] === 1 || this.match.field[y-1][x+1] === 2)){
      if((y > 1 && x < 6) && this.match.field[y-2][x + 2] === 0) {
        this.choics.push(`${y - 2}-${x + 2}`);
      }
    }

    // this.match.field[y-1][x+1] === 0 &&  this.choics.push(`${y - 1}-${x + 1}`);
  } else {

    if( (y < 7 && x > 0 )  && (this.match.field[y+1][x-1] === 3 || this.match.field[y+1][x-1] === 4)){
      if((x > 1 && y < 6) &&this.match.field[y+2][x-2] === 0){
        this.choics.push(`${y + 2}-${x - 2}`);
      }
    }
    if( (y < 7 && x < 7 ) && (this.match.field[y+1][x+1] === 3 || this.match.field[y+1][x+1] === 4)){

      if(( y < 6 && x < 6  ) &&this.match.field[y+2][x + 2] === 0) {
        this.choics.push(`${y + 2}-${x + 2}`);

      }
   } 
}
return {y,x};
}


}
