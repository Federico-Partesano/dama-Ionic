import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Credentials } from 'src/models/credentials';
import { AuthService } from './services/auth.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private auth: AuthService, private router: Router) {
    
  }

 async ngOnInit() {
   console.log('init')
  await  this.auth.createStorage();
    await this.auth.connectSocket();

    this.auth.socket.on('connect',() =>{
      console.log('connection');
    })
  
    const credentials = await this.auth.getItemStorage<Credentials>('credentials');
    this.router.navigate([ !!credentials ? '/home' : '/login' ])
    };
  

}
