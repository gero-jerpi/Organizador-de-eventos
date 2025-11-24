export interface User {
  id?: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'admin';
}

export interface NewUser {
  name: string;
  lastName: string;
  email: string;
  phone: string;
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
