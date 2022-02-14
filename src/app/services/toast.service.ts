import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toastController: ToastController) {}


  async presentToast(error: string) {
    const toast = await this.toastController.create({
      color: "danger",
      message: `${error}`,
      duration: 2000
    });
    toast.present();
  }
  
}
