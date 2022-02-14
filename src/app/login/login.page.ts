import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public signUpForm = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private root: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      nickname: [''],
      password: [''],

    });
  }

  logIn = async() => {
    try{
      const accessToken = await this.authService.login({nickname:this.signUpForm.controls.nickname.value, password:this.signUpForm.controls.password.value});
    await this.authService.setItemStorage('credentials', {nickname: this.signUpForm.controls.nickname.value, ...accessToken });
    console.log(await this.authService.getItemStorage('credentials'));
    this.root.navigate(['/home']);
    } catch({error: {error}}) {
      console.log(error);
      this.toastService.presentToast(error);
    }
  };




}
