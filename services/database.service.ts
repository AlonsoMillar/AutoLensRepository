import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  // Obtener todos los usuarios registrados
  async getAllUsers(): Promise<any[]> {
    const { value } = await Preferences.get({ key: 'local_users' });
    return value ? JSON.parse(value) : [];
  }

  // Guardar un nuevo usuario (Lo usaremos en el Register)
  async saveUserLocal(user: any): Promise<boolean> {
    const users = await this.getAllUsers();
    
    // Verificamos que el email no exista ya
    const exists = users.find(u => u.email === user.email);
    if (exists) return false; 

    users.push(user);
    await Preferences.set({ key: 'local_users', value: JSON.stringify(users) });
    return true;
  }

  // Validar credenciales (Lo usa el AuthService para el Login)
  async validateUser(email: string, pass: string): Promise<any> {
    const users = await this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === pass);
    return user ? user : null; // Retorna el usuario si coincide, o null si falla
  }
}