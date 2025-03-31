import { Injectable, signal, WritableSignal } from '@angular/core';
import { ContactCreateDTO, ContactModel } from '../models/contact.model';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';

/**
 * Los pasos para implementar SQLite en mi app:
 * 1. Instalar las dependencias:
 * npm install @capacitor-community/sqlite
 *
 * 2. Inicializar la base de datos:
 * Crear un metodo que se encargue de iniciarlizar o crear las tablas de mi base de datos
 *
 * 3. Crear los metodos para CRUD de mi base de datos
 * Guardar - Leer - Actualizar y Eliminar
 *
 */

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private sqliteconnection: SQLiteConnection = new SQLiteConnection(
    CapacitorSQLite
  );
  private db?: SQLiteDBConnection;
  public contacts: WritableSignal<ContactModel[]> = signal<ContactModel[]>([]);

  constructor() {
    if (Capacitor.getPlatform() === 'web') {
      const currentContacts = localStorage.getItem('list-of-contacts');
      if (currentContacts) {
        this.contacts.set(JSON.parse(currentContacts));
      }
    }
  }

  getContacts() {
    return this.contacts;
  }

  getContactById(id: number) {
    const contactsTemp = this.contacts();
    return contactsTemp.find((contact) => contact.id === id);
  }

  async initializeDB() {
    try {
      this.db = await this.sqliteconnection.createConnection(
        'contacts-db',
        false,
        'no-encryption',
        1,
        false
      );

      await this.db.open();

      const tableScheme = `
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT,
        address TEXT
      );
      `;

      await this.db.execute(tableScheme);

      this.loadContactsFromDB();
    } catch (error) {}
  }

  async loadContactsFromDB() {
    try {
      const result = await this.db?.query('SELECT * FROM contacts');
      this.contacts.set(result?.values as ContactModel[]);
    } catch (error) {
      console.log(error);
    }
  }

  async saveNewContact(contact: ContactCreateDTO) {
    if (contact.name === '') {
      return false;
    }

    try {
      if (Capacitor.getPlatform() === 'web') {
        this.saveContactsToLocalStorage(contact);
      } else {
        // Save on the database SQLite
        const query = `INSERT INTO contacts (name, email, phone, address)
        VALUES ('${contact.name}', '${contact.email}', '${contact.phone}', '${contact.address}')`;

        await this.db?.execute(query);
        this.loadContactsFromDB();
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async updateContact(contact: ContactModel) {
    if (Capacitor.getPlatform() === 'web') {
      await this.updateOnLocalStorage(contact);
      return true;
    }

    try {
      const updateQuery = `UPDATE contacts SET name = '${contact.name}', email = '${contact.email}', phone = '${contact.phone}', address = '${contact.address}' WHERE id = ${contact.id}`;

      await this.db?.execute(updateQuery);
      this.loadContactsFromDB();

      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteContact(contact: ContactModel) {
    if (Capacitor.getPlatform() === 'web') {
      await this.deleteOnLocalStorage(contact);
      return true;
    }

    try {
      const deleteQuery = `DELETE FROM contacts WHERE id = ${contact.id}`;

      await this.db?.execute(deleteQuery);
      this.loadContactsFromDB();

      return true;
    } catch (error) {
      return false;
    }
  }

  // Save contacts to local storage when I am on a web platform
  private saveContactsToLocalStorage(contact: ContactCreateDTO) {
    const currentContacts = localStorage.getItem('list-of-contacts');
    if (currentContacts) {
      const currectContactsJson: ContactModel[] = JSON.parse(currentContacts);
      const newContactToSave: ContactModel = {
        ...contact,
        id: currectContactsJson.length + 1,
      };
      currectContactsJson.push(newContactToSave);
      localStorage.setItem(
        'list-of-contacts',
        JSON.stringify(currectContactsJson)
      );
      // Update the contacts array
      //this.contacts = currectContactsJson; old way
      this.contacts.set(currectContactsJson);
    } else {
      const newContactToSave: ContactModel = { ...contact, id: 1 };
      localStorage.setItem(
        'list-of-contacts',
        JSON.stringify([newContactToSave])
      );
      // Update the contacts array
      //this.contacts = [newContactToSave]; old way
      this.contacts.set([newContactToSave]);
    }
  }

  private async updateOnLocalStorage(contact: ContactModel) {
    const currentContacts = localStorage.getItem('list-of-contacts');
    if (currentContacts) {
      const currectContactsJson: ContactModel[] = JSON.parse(currentContacts);
      const indexToUpdate = currectContactsJson.findIndex(
        (contactLocaStorage) => contactLocaStorage.id === contact.id
      );
      currectContactsJson[indexToUpdate] = contact;
      localStorage.setItem(
        'list-of-contacts',
        JSON.stringify(currectContactsJson)
      );
      // Update the contacts array
      //this.contacts = currectContactsJson; old way
      this.contacts.set(currectContactsJson);
    }
  }

  private async deleteOnLocalStorage(contact: ContactModel) {
    const currentContacts = localStorage.getItem('list-of-contacts');
    if (currentContacts) {
      const currectContactsJson: ContactModel[] = JSON.parse(currentContacts);
      const indexToDelete = currectContactsJson.findIndex(
        (contactLocaStorage) => contactLocaStorage.id === contact.id
      );
      currectContactsJson.splice(indexToDelete, 1);
      localStorage.setItem(
        'list-of-contacts',
        JSON.stringify(currectContactsJson)
      );
      // Update the contacts array
      //this.contacts = currectContactsJson; old way
      this.contacts.set(currectContactsJson);
    }
  }
}
