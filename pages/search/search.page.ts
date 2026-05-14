import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false
})
export class SearchPage implements OnInit {

  // Nuestra base de datos simulada de lecturas anteriores
  historial = [
    { patente: 'AB-CD-12', fecha: 'Hoy, 14:30', estado: 'Sin encargo', color: 'success', icono: 'checkmark-circle' },
    { patente: 'XX-YY-99', fecha: 'Ayer, 09:15', estado: 'Encargo por robo', color: 'danger', icono: 'alert-circle' },
    { patente: 'HT-KL-55', fecha: '10 Mar, 18:45', estado: 'Sin encargo', color: 'success', icono: 'checkmark-circle' },
    { patente: 'ZZ-00-11', fecha: '05 Mar, 11:20', estado: 'Multas impagas', color: 'warning', icono: 'warning' },
    { patente: 'FR-ST-33', fecha: '02 Mar, 16:10', estado: 'Sin encargo', color: 'success', icono: 'checkmark-circle' }
  ];

  // Lista que se mostrará en pantalla (cambia cuando buscamos algo)
  resultados = [...this.historial];

  constructor() { }

  ngOnInit() {
  }

  // Función que se ejecuta cada vez que escribes en la barra de búsqueda
  buscarPatente(event: any) {
    const texto = event.target.value.toLowerCase();
    
    // Filtramos el historial para ver si incluye lo que escribimos
    this.resultados = this.historial.filter(item => {
      return item.patente.toLowerCase().includes(texto);
    });
  }

}