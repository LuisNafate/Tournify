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

  // Configuración de privacidad
  isPrivate: boolean;
  requiresApproval: boolean;
  accessCode?: string;

  // Configuración de fases
  hasGroupStage: boolean;
  numberOfGroups?: number;
  teamsPerGroup?: number;
  teamsAdvancePerGroup?: number;

  // Ajustes deportivos específicos
  sportSettings?: {
    matchDuration?: number; // Duración del partido en minutos
    halves?: number; // Número de tiempos
    halfDuration?: number; // Duración de cada tiempo
    extraTime?: boolean; // ¿Tiempo extra?
    penalties?: boolean; // ¿Penales?
    playersPerTeam?: number; // Jugadores por equipo
    substitutions?: number; // Sustituciones permitidas
    sets?: number; // Para deportes como voleibol/tenis
    pointsToWin?: number; // Puntos para ganar un set
  };

  // Configuración adicional
  allowTies: boolean;
  pointsForWin: number;
  pointsForDraw: number;
  pointsForLoss: number;
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
    image: null,

    // Configuración de privacidad
    isPrivate: false,
    requiresApproval: false,
    accessCode: '',

    // Configuración de fases
    hasGroupStage: false,
    numberOfGroups: 4,
    teamsPerGroup: 4,
    teamsAdvancePerGroup: 2,

    // Ajustes deportivos específicos
    sportSettings: {
      matchDuration: 90,
      halves: 2,
      halfDuration: 45,
      extraTime: true,
      penalties: true,
      playersPerTeam: 11,
      substitutions: 5,
      sets: 3,
      pointsToWin: 25
    },

    // Configuración adicional
    allowTies: false,
    pointsForWin: 3,
    pointsForDraw: 1,
    pointsForLoss: 0
  };

  imagePreview: string | null = null;

  constructor(private router: Router) {}

  // Obtener nombre legible del deporte
  getSportName(sport: string): string {
    const sports: { [key: string]: string } = {
      'football': 'Fútbol',
      'basketball': 'Baloncesto',
      'volleyball': 'Voleibol',
      'tennis': 'Tenis',
      'handball': 'Balonmano',
      'tabletennis': 'Tenis de Mesa',
      'esports': 'eSports'
    };
    return sports[sport] || sport;
  }

  // Método para actualizar configuración deportiva según el deporte seleccionado
  onSportChange(): void {
    switch (this.tournament.sport) {
      case 'football':
        this.tournament.sportSettings = {
          matchDuration: 90,
          halves: 2,
          halfDuration: 45,
          extraTime: true,
          penalties: true,
          playersPerTeam: 11,
          substitutions: 5
        };
        break;
      case 'basketball':
        this.tournament.sportSettings = {
          matchDuration: 40,
          halves: 4,
          halfDuration: 10,
          extraTime: true,
          penalties: false,
          playersPerTeam: 5,
          substitutions: 99
        };
        break;
      case 'volleyball':
        this.tournament.sportSettings = {
          sets: 5,
          pointsToWin: 25,
          playersPerTeam: 6,
          substitutions: 6
        };
        break;
      case 'tennis':
        this.tournament.sportSettings = {
          sets: 3,
          pointsToWin: 6,
          playersPerTeam: 1,
          substitutions: 0
        };
        break;
      case 'handball':
        this.tournament.sportSettings = {
          matchDuration: 60,
          halves: 2,
          halfDuration: 30,
          extraTime: true,
          penalties: true,
          playersPerTeam: 7,
          substitutions: 99
        };
        break;
      case 'tabletennis':
        this.tournament.sportSettings = {
          sets: 5,
          pointsToWin: 11,
          playersPerTeam: 1,
          substitutions: 0
        };
        break;
      case 'esports':
        this.tournament.sportSettings = {
          playersPerTeam: 5,
          substitutions: 2
        };
        break;
      default:
        this.tournament.sportSettings = {};
    }
  }

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
