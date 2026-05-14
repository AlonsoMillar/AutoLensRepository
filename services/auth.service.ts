import { Injectable } from '@angular/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Preferences } from '@capacitor/preferences';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'autolens_session';

  // Inyectamos el DatabaseService (El Archivero)
  constructor(private dbService: DatabaseService) {
    this.initializeApp();
  }

  async initializeApp() {
    await GoogleAuth.initialize({
      clientId: '878983344319-8foqajj5ud3v7os23ckvheok6ltdb6me.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }

  // ==========================================
  // 1. MANEJO DE SESIÓN (PERSISTENCIA CORTA)
  // ==========================================
  async saveSession(data: any) {
    await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(data) });
  }

  async getSession() {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    return value ? JSON.parse(value) : null;
  }

  // ==========================================
  // 2. AUTENTICACIÓN LOCAL (CON BASE DE DATOS)
  // ==========================================
  
  // AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA (Adiós error TS2339)
  async registerLocal(nombre: string, email: string, pass: string): Promise<boolean> {
    try {
      const newUser = {
        nombre: nombre,
        email: email,
        password: pass, 
        foto: '', 
        provider: 'local'
      };

      // Le pedimos al DB Service que lo guarde
      const isSaved = await this.dbService.saveUserLocal(newUser);

      if (isSaved) {
        // Si se guardó bien, iniciamos sesión automáticamente
        await this.saveSession({
          nombre: newUser.nombre,
          email: newUser.email,
          foto: newUser.foto,
          provider: 'local'
        });
        return true;
      }
      return false; // Retorna false si el correo ya existía
    } catch (error) {
      console.error('Error al registrar usuario localmente:', error);
      return false;
    }
  }

  async loginLocal(email: string, pass: string): Promise<boolean> {
    const validUser = await this.dbService.validateUser(email, pass);
    
    if (validUser) {
      await this.saveSession({
        nombre: validUser.nombre,
        email: validUser.email,
        foto: validUser.foto,
        provider: 'local'
      });
      return true;
    }
    return false; 
  }

  // ==========================================
  // 3. AUTENTICACIÓN CON GOOGLE
  // ==========================================
  async loginWithGoogle(): Promise<any> {
    try {
      const googleUser = await GoogleAuth.signIn();
      const sessionData = {
        nombre: googleUser.name || `${googleUser.givenName} ${googleUser.familyName}`,
        email: googleUser.email,
        foto: googleUser.imageUrl,
        provider: 'google',
        token: googleUser.authentication.idToken
      };

      await this.saveSession(sessionData);
      return sessionData;
    } catch (error) {
      console.error('Error en Google Auth:', error);
      throw error;
    }
  }

  async logout() {
    await Preferences.remove({ key: this.STORAGE_KEY });
    try {
      await GoogleAuth.signOut();
    } catch (e) {
      console.log('Sesión de Google ya cerrada');
    }
  }
}