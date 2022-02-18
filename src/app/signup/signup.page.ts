import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signUpForm = new FormGroup({});
  ismodalOpen: boolean = false;
  selectedImage: string = 'horse.jpg';
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.signUpForm = this.formBuilder.group({
      nickname: [''],
      password: [''],
    });
  }

  openModal = () => this.ismodalOpen = true;
  emitted(event: string) {
    this.selectedImage = event;
    this.ismodalOpen = false;
  }

  closeModal = () => this.ismodalOpen = false;

  signUp = async () => {
    try {
      await this.authService.signup({
        nickname: this.signUpForm.controls.nickname.value,
        password: this.signUpForm.controls.password.value,
        cover: this.selectedImage,
      });
      this.router.navigate(['/login'])
    } catch ({ error: { error } }) {
      console.log(error);
      this.toastService.presentToast(error);
    }
  };
}
