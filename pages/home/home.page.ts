import { Component, OnInit } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { ScannerService } from '../../services/scanner.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
// Importación corregida para Capacitor 8
import { CapacitorPluginMlKitTextRecognition } from '@pantrist/capacitor-plugin-ml-kit-text-recognition';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  showManualEntry = false;
  manualPlate = '';
  userData: any = { nombre: 'Usuario', foto: '', email: '' };

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private navCtrl: NavController,
    private scannerService: ScannerService 
  ) { }

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    const session = await this.authService.getSession();
    if (session) { 
      this.userData = session; 
    }
  }

  // Función que llama el HTML
  async startScan() {
    await this.scanFromCamera();
  }

  async scanFromCamera() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera 
      });

      if (image.path) {
        this.processImage(image.path);
      }
    } catch (error) {
      console.log('Cámara cancelada o error');
    }
  }

  async scanFromGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos 
      });

      if (image.path) {
        this.processImage(image.path);
      }
    } catch (error) {
      console.log('Galería cancelada');
    }
  }

 async processImage(imagePath: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Analizando patente...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // 2. Usamos (CapacitorPluginMlKitTextRecognition as any) 
      // para forzar a TypeScript a ejecutar el método sin quejarse
      const result = await (CapacitorPluginMlKitTextRecognition as any).recognizeText({
        path: imagePath,
      });

      console.log('Resultado del OCR:', result);

      let foundPlate: string | null = null;

      // El plugin devuelve bloques de texto
      if (result && result.blocks) {
        for (let block of result.blocks) {
          foundPlate = this.scannerService.getCleanPlate(block.text);
          if (foundPlate) break;
        }
      }

      await loading.dismiss();

      if (foundPlate) {
        this.presentToast(`Patente: ${foundPlate}`, 'success', 'checkmark-circle');
        // Navegación (Descomentar cuando InfoCar esté listo)
        // this.navCtrl.navigateForward(['/info-car', { plate: foundPlate }]);
      } else {
        this.presentToast('No se detectó una patente clara.', 'warning', 'alert-circle');
      }

    } catch (error) {
      await loading.dismiss();
      this.presentToast('Error al leer la imagen.', 'danger', 'bug');
      console.error('Error OCR:', error);
    }
  }
  async presentToast(message: string, color: string, icon: string) {
    const toast = await this.toastCtrl.create({
      message, duration: 3000, color, icon, position: 'top'
    });
    await toast.present();
  }

  async logout() {
    const loading = await this.loadingCtrl.create({ message: 'Cerrando sesión...' });
    await loading.present();
    await this.authService.logout();
    await loading.dismiss();
    this.navCtrl.navigateRoot('/login');
  }

  toggleManualEntry() { this.showManualEntry = !this.showManualEntry; }

  async submitManualPlate() {
    const validatedPlate = this.scannerService.getCleanPlate(this.manualPlate);
    
    if (!validatedPlate) {
      this.presentToast('Formato de patente no válido.', 'danger', 'close-circle');
      return;
    }

    this.manualPlate = '';
    this.showManualEntry = false;
    this.presentToast(`Buscando: ${validatedPlate}`, 'primary', 'search');
  }
}