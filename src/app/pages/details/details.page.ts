import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonItem,
  IonList,
  IonButton,
  IonIcon,
  IonInput,
  ToastController,
  IonBackButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { DatabaseService } from 'src/app/services/database.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ContactModel } from 'src/app/models/contact.model';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  closeCircleOutline,
  createOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonButtons,
    IonBackButton,
    IonInput,
    IonIcon,
    IonButton,
    IonList,
    IonItem,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class DetailsPage implements OnInit {
  contact: ContactModel = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
  };

  contactBase: ContactModel = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
  };
  editing = false;

  constructor(
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private router: NavController,
    private toastController: ToastController
  ) {
    addIcons({ createOutline, closeCircleOutline, arrowBackOutline });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const id = Number(params['id']);
      const contactFound = this.databaseService.getContactById(id);
      if (contactFound) {
        this.contact = contactFound;
      }
    });
  }

  activeEdit() {
    if (this.editing === false) {
      this.editing = true;
      this.contactBase = { ...this.contact };
      console.log({ base: this.contactBase });
      return;
    } else {
      this.saveEditiding();
    }
  }

  async saveEditiding() {
    console.log({ contact: this.contact });
    const isSaved = await this.databaseService.updateContact(this.contact);

    if (isSaved) {
      this.editing = false;
      this.contactBase = { ...this.contact };
      const toast = await this.toastController.create({
        message: 'Contacto actualizado',
        duration: 2000,
        color: 'success',
        position: 'bottom',
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: 'Falló la actualización',
        duration: 2000,
        color: 'danger',
        position: 'bottom',
      });
      toast.present();
    }
  }

  cancel() {
    this.editing = false;
    this.contact = { ...this.contactBase };
  }
}
