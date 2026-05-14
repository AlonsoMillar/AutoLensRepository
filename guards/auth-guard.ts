import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  async canActivate(): Promise<boolean> {
    try {
      // Intentamos obtener el usuario del almacenamiento persistente
      const { value } = await Preferences.get({ key: 'user' });

      if (value) {
        // Si hay datos, se permite el acceso
        return true;
      } else {
        // Si no hay datos, redirigimos al login
        this.router.navigate(['/login']);
        return false;
      }
    } catch (error) {
      // En caso de error de lectura, redirigimos por seguridad
      this.router.navigate(['/login']);
      return false;
    }
  }
}