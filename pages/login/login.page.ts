import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  // Variables conectadas al HTML vía ngModel
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  // === NUEVA FUNCIÓN: LOGIN LOCAL ===
  async loginLocal() {
    // 1. Validar que no envíen campos vacíos
    if (!this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, ingresa tu correo y contraseña.',
        duration: 2000,
        color: 'warning',
        position: 'top',
        icon: 'alert-circle-outline'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Verificando credenciales...',
      spinner: 'dots'
    });
    await loading.present();

    // 2. Llamamos al servicio que a su vez verificará en la base de datos local
    const success = await this.authService.loginLocal(this.email, this.password);
    
    await loading.dismiss();

    // 3. Evaluamos el resultado
    if (success) {
      // Limpiamos los campos por seguridad
      this.email = '';
      this.password = '';
      this.router.navigate(['/home']);
    } else {
      const toast = await this.toastCtrl.create({
        message: 'Credenciales incorrectas o usuario no registrado.',
        duration: 3000,
        color: 'danger',
        position: 'top',
        icon: 'close-circle-outline'
      });
      await toast.present();
    }
  }

  // === FUNCIÓN GOOGLE (Intacta) ===
  async loginWithGoogle() {
    const loading = await this.loadingCtrl.create({
      message: 'Conectando con Google...',
      spinner: 'crescent',
    });
    await loading.present();

    try {
      const sessionData = await this.authService.loginWithGoogle();
      await loading.dismiss();

      const toast = await this.toastCtrl.create({
        message: `¡Bienvenido, ${sessionData.nombre}!`,
        duration: 2000,
        position: 'top',
        color: 'success',
        icon: 'checkmark-circle'
      });
      await toast.present();

      this.router.navigate(['/home']);

    } catch (error) {
      await loading.dismiss();
      console.error('Error al iniciar sesión con Google:', error);
      
      const toast = await this.toastCtrl.create({
        message: 'No se pudo iniciar sesión con Google.',
        duration: 3000,
        position: 'top',
        color: 'danger',
        icon: 'alert-circle'
      });
      await toast.present();
    }
  }
}