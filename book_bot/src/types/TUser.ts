export type TUser = {
  id: number;
  telegram_id: number;
  username: string | null;
  chat_id: number;
  role: EUserRole;
  registration_date: string;
}

export type TContactDetails = {
  first_name: string | null;
  last_name: string | null;
  region: string | null;
  email: string | null;
  data_processing_consent: boolean | null;
  created_at: string | null;
  updated_at: string | null;
}

export enum EUserRole {
  ADMIN = 'admin',
  USER = 'user', 
}

export type TUserFullInfo = {
  user: TUser;
  contact_details: TContactDetails;
}