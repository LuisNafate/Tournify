import { Component } from '@angular/core';
import { Router } from '@angular/router';

// Interface para el modelo del torneo
interface Tournament {
  name: string;
  sport: string;
  tournamentType: string;
  category: string;
  eliminationMode: string;
  location: string;
  startDate: string;
  endDate: string;
  maxTeams: number;
  registrationFee?: number;
  description?: string;
  image?: File | null;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  tournament: Tournament = {
    name: '',
    sport: '',
    tournamentType: '',
    category: '',
    eliminationMode: '',
    location: '',
    startDate: '',
    endDate: '',
    maxTeams: 16,
    registrationFee: 0,
    description: '',
    image: null
  };

  imagePreview: string | null = null;

  constructor(private router: Router) {}

  onImageSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen no debe superar los 5MB');
        return;
      }

      // Validar tipo
      if (!file.type.match('image/(png|jpeg|jpg)')) {
        alert('Solo se permiten imágenes PNG, JPG o JPEG');
        return;
      }

      this.tournament.image = file;

      // Crear preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.tournament.image = null;
    this.imagePreview = null;
  }

  onSubmit(): void {
    // Validar que los campos requeridos estén completos
    if (this.validateForm()) {
      console.log('Torneo creado:', this.tournament);

      // Aquí iría la lógica para enviar los datos al backend
      // Por ahora solo mostramos un mensaje de confirmación
      alert('Torneo creado exitosamente!');

      // Redirigir a la lista de torneos o al detalle del torneo creado
      this.router.navigate(['/tournaments/list']);
    } else {
      alert('Por favor, completa todos los campos requeridos');
    }
  }

  private validateForm(): boolean {
    // Validar campos requeridos básicos
    if (!this.tournament.name ||
        !this.tournament.sport ||
        !this.tournament.tournamentType ||
        !this.tournament.eliminationMode ||
        !this.tournament.location ||
        !this.tournament.startDate ||
        !this.tournament.endDate ||
        !this.tournament.maxTeams) {
      return false;
    }

    // Validar categoría solo si es campeonato por categorías
    if (this.tournament.tournamentType === 'categories' && !this.tournament.category) {
      alert('Por favor, selecciona una categoría para el campeonato por categorías');
      return false;
    }

    // Validar que la fecha de fin sea posterior a la fecha de inicio
    if (new Date(this.tournament.endDate) <= new Date(this.tournament.startDate)) {
      alert('La fecha de finalización debe ser posterior a la fecha de inicio');
      return false;
    }

    // Validar que el número de equipos sea mayor a 1
    if (this.tournament.maxTeams < 2) {
      alert('El número de equipos debe ser al menos 2');
      return false;
    }

    return true;
  }
}
