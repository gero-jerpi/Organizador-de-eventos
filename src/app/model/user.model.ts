export interface User {
  id?: number;         
  name: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
}

export interface NewUser {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'admin';
}

export interface RegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}