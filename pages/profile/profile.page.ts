import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  // Variable para guardar los datos del usuario logueado
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) { }

  // Se ejecuta apenas la página está por cargar
  async ngOnInit() {
    await this.cargarPerfil();
  }

  // Se ejecuta cada vez que entramos a la página (por si la sesión cambia)
  async ionViewWillEnter() {
    await this.cargarPerfil();
  }

  async cargarPerfil() {
    // Le pedimos al AuthService quién está logueado
    this.usuario = await this.authService.getSession();
  }

  async logout() {
    // Cerramos la sesión en el servicio
    await this.authService.logout();
    
    // Lo mandamos de regreso al login borrando el historial
    this.navCtrl.navigateRoot('/login');
  }
}