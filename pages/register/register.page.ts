import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController } from '@ionic/angular'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  // Variables conectadas al HTML vía ngModel
  nombre: string = '';
  email: string = '';
  password: string = '';

  // --- VARIABLES PARA EL OJITO ---
  passwordType: string = 'password'; 
  passwordIcon: string = 'eye-off-outline'; 

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  // --- FUNCIÓN DEL OJITO (Aquí está la que no encontraba) ---
  togglePassword() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passwordIcon = 'eye-outline';
    } else {
      this.passwordType = 'password';
      this.passwordIcon = 'eye-off-outline';
    }
  }

  // --- FUNCIÓN DE REGISTRO ---
  async registerLocal() {
    // 1. Validar que no haya campos vacíos
    if (!this.nombre || !this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, completa todos los campos.',
        duration: 2000,
        color: 'warning',
        position: 'top',
        icon: 'alert-circle-outline'
      });
      await toast.present();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creando cuenta...',
      spinner: 'dots'
    });
    await loading.present();

    // 2. Llamamos al servicio (El Guardia le avisa al Archivero)
    const success = await this.authService.registerLocal(this.nombre, this.email, this.password);
    
    await loading.dismiss();

    // 3. Evaluamos el resultado
    if (success) {
      const toast = await this.toastCtrl.create({
        message: '¡Cuenta creada con éxito!',
        duration: 2000,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle-outline'
      });
      await toast.present();

      // Limpiamos los campos
      this.nombre = '';
      this.email = '';
      this.password = '';
      
      // Viaje directo al Home
      this.navCtrl.navigateRoot('/home'); 
    } else {
      // Si success es false, probablemente el correo ya existe
      const toast = await this.toastCtrl.create({
        message: 'El correo ya está registrado. Intenta con otro o inicia sesión.',
        duration: 3500,
        color: 'danger',
        position: 'top',
        icon: 'close-circle-outline'
      });
      await toast.present();
    }
  }
}