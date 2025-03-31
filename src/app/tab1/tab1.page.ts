import { Component, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { DatabaseService } from '../services/database.service';
import { ContactModel } from '../models/contact.model';
import { CommonModule } from '@angular/common';

import { NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonIcon,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonItem,
    IonList,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
  ],
})
export class Tab1Page {
  contacts = this.databaseService.getContacts();
  constructor(
    private databaseService: DatabaseService,
    private router: NavController,
    private toastController: ToastController
  ) {
    addIcons({ trashOutline });
  }

  goDetails(id: number) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: id,
      },
    };

    this.router.navigateForward(['details'], navigationExtras);
  }

  async deleteContact(contact: ContactModel) {
    const isDeleted = await this.databaseService.deleteContact(contact);
    if (isDeleted) {
      const toast = await this.toastController.create({
        message: 'Contacto eliminado',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      toast.present();
    }
  }
}
