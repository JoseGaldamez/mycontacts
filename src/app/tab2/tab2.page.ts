import { Component } from '@angular/core';
import { ContactCreateDTO } from '../models/contact.model';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonButton,
  ToastController,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonButton,
    IonList,
    IonItem,
    IonInput,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
  ],
})
export class Tab2Page {
  newContact: ContactCreateDTO = {
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  constructor(
    private databaseService: DatabaseService,
    private toastController: ToastController
  ) {}

  isFormInComplete() {
    return (
      this.newContact.name === '' ||
      this.newContact.email === '' ||
      this.newContact.phone === '' ||
      this.newContact.address === ''
    );
  }

  async onSubmit() {
    const result = await this.databaseService.saveNewContact(this.newContact);
    let toast;

    if (result) {
      toast = await this.toastController.create({
        message: 'Contacto creado correctamente',
        duration: 3000,
        position: 'bottom',
        color: 'success',
      });
      this.newContact = {
        name: '',
        email: '',
        phone: '',
        address: '',
      };
    } else {
      toast = await this.toastController.create({
        message: 'Error al crear el contacto',
        duration: 3000,
        position: 'bottom',
        color: 'danger',
      });
    }

    await toast.present();
  }
}
