// Modelo de usuario
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'player' | 'organizer' | 'referee';
  createdAt?: Date;
}
