import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor() { }

  /**
   * Recibe un bloque de texto sucio y devuelve una patente limpia
   * Ej: "Chile - AB CD 12" -> "ABCD12"
   */
  getCleanPlate(rawText: string): string | null {
    // 1. Limpieza total: quitar espacios, guiones, puntos y pasar a mayúsculas
    const clean = rawText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // 2. Expresión Regular para Chile:
    // Formato nuevo: 4 letras + 2 números (ej. BB CC 12)
    // Formato viejo: 2 letras + 4 números (ej. AB 12 34)
    const plateRegex = /([A-Z]{4}[0-9]{2})|([A-Z]{2}[0-9]{4})/;

    const match = clean.match(plateRegex);

    if (match) {
      return match[0]; // Retorna solo la parte que coincide con el formato
    }

    return null;
  }
}