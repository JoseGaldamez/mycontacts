export interface ContactModel {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export type ContactCreateDTO = Omit<ContactModel, 'id'>;
