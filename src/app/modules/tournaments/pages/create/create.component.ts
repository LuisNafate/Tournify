import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { TournamentService } from '../../services/tournament.service';
import { SportService } from '../../../../core/services/sport.service';
import { CreateTournamentRequest } from '../../../../core/models/tournament.model';
import { Sport } from '../../../../core/models/sport.model';

// Interface para el modelo del torneo
interface Tournament {
  name: string;
  sport: string;
  sportSubType?: string;
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
  // Reglas específicas (texto editable)
  rules?: string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
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

  // Reglas por defecto para los eSports soportados
  defaultEsportRules: { [key: string]: string } = {
    valorant: `Reglas básicas - Valorant:\n\n1) Formato de partidas: Bo1/Bo3/Bo5 según la fase.\n2) Map Pool: Se usará el pool oficial vigente; veto según el sistema de la organización.\n3) Composición de equipos: 5 jugadores activos, 1 sustituto máximo.\n4) Pausas: 2 pausas por equipo de 60 segundos cada una (no acumulables).\n5) Conexiones: Si un jugador desconecta, se espera un máximo de 5 minutos; si no vuelve, el partido continúa; decisiones del árbitro son definitivas.\n6) Uso de exploits/bug: Cualquier explotación de bugs resulta en pérdida del mapa y posible descalificación.\n7) Comportamiento antideportivo: Insultos, racismo o cheating implica sanción o descalificación.\n8) Penalizaciones por retraso y no presentación: Aplican según normativa de la organización.\n\nEstas reglas son una guía; la organización puede adaptarlas para su torneo.`,

    lol: `Reglas básicas - League of Legends (LoL):\n\n1) Formato de partidas: Bo1/Bo3/Bo5 según la fase.\n2) Composición: 5 jugadores titulares y hasta 2 suplentes.\n3) Campeones: Se jugará en modo Draft Pick; bans según el formato (normalmente 5 bans por equipo en Bo3+).\n4) Remakes: Se permite remake si un jugador desconecta antes del minuto 3 y no puede reconectar en tiempo razonable; aplica según reglas de la organización.\n5) Pausas: 2 pausas por equipo de 60 segundos cada una.\n6) Mal comportamiento: Sanciones por actitud tóxica, uso de cheats o exploits.\n7) Conexiones y sustituciones: Reglas específicas según el reglamento del evento.\n\nAdaptar según normativa oficial y parches vigentes.`,

    clash: `Reglas básicas - Clash (Clash Royale / Clash of Clans style - confirmar juego exacto):\n\nNota: 'Clash' puede referirse a varios títulos. Estas reglas son genéricas y deben ajustarse al juego concreto:\n\n1) Formato: Bo1/Bo3 dependiendo de la fase.\n2) Composición de equipos/jugadores: Según el juego (ej: 1v1 en Clash Royale, 5v5 en otros).\n3) Pausas y desconexiones: Se permite un breve tiempo de espera; reglas específicas definidas por la organización.\n4) Uso de bugs o exploits: Penalización inmediata.\n5) Reglas de empates y desempates: Definidas por la organización (puntos, diferencia o mapas adicionales).\n\nPor favor confirma el título exacto para adaptar las reglas oficiales.`
  };

  imagePreview: string | null = null;
  submitting = false;
  submitError: string | null = null;

  // Lista de deportes disponibles cargada desde el backend
  availableSports: Sport[] = [];
  loadingSports = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tournamentService: TournamentService,
    private sportService: SportService
  ) {}

  ngOnInit(): void {
    // El AuthGuard ya maneja la verificación de autenticación
    this.loadSports();
  }

  // Cargar deportes desde el backend
  loadSports(): void {
    this.loadingSports = true;
    this.sportService.getAll().subscribe({
      next: (sports) => {
        this.availableSports = sports;
        this.loadingSports = false;
        console.log('Deportes cargados:', sports);
      },
      error: (err) => {
        console.error('Error al cargar deportes:', err);
        this.loadingSports = false;
        // Usar valores por defecto si falla la carga
        alert('No se pudieron cargar los deportes. Por favor, recarga la página.');
      }
    });
  }

  // Obtener nombre legible del deporte
  getSportName(sport: string): string {
    const sports: { [key: string]: string } = {
      'football': 'Fútbol',
      'basketball': 'Baloncesto',
      'volleyball': 'Voleibol',
      'esports': 'eSports'
    };
    return sports[sport] || sport;
  }

  // Obtener el deporte seleccionado actualmente
  getSelectedSport(): Sport | undefined {
    return this.availableSports.find(s => s.id === this.tournament.sport);
  }

  // Método para actualizar configuración deportiva según el deporte seleccionado
  onSportChange(): void {
    // Buscar el deporte seleccionado
    const selectedSport = this.availableSports.find(s => s.id === this.tournament.sport);

    if (!selectedSport) {
      this.tournament.sportSettings = {};
      return;
    }

    // Usar la categoría del deporte para determinar si es esport
    const isEsport = selectedSport.category === 'esport';

    // Si se cambia el deporte y no es eSports, limpiar subtipo y reglas
    if (!isEsport) {
      this.tournament.sportSubType = undefined;
      this.tournament.rules = undefined;
    }

    // Configurar settings basados en el nombre del deporte
    const sportName = selectedSport.name.toLowerCase();

    if (sportName.includes('fútbol') || sportName.includes('football') || sportName.includes('soccer')) {
      this.tournament.sportSettings = {
        matchDuration: 90,
        halves: 2,
        halfDuration: 45,
        extraTime: true,
        penalties: true,
        playersPerTeam: selectedSport.defaultPlayersPerTeam || 11,
        substitutions: 5
      };
    } else if (sportName.includes('baloncesto') || sportName.includes('basketball')) {
      this.tournament.sportSettings = {
        matchDuration: 40,
        halves: 4,
        halfDuration: 10,
        extraTime: true,
        penalties: false,
        playersPerTeam: selectedSport.defaultPlayersPerTeam || 5,
        substitutions: 99
      };
    } else if (sportName.includes('voleibol') || sportName.includes('volleyball')) {
      this.tournament.sportSettings = {
        sets: 5,
        pointsToWin: 25,
        playersPerTeam: selectedSport.defaultPlayersPerTeam || 6,
        substitutions: 6
      };
    } else if (isEsport) {
      this.tournament.sportSettings = {
        playersPerTeam: selectedSport.defaultPlayersPerTeam || 5,
        substitutions: 2
      };
      // inicializar reglas vacías; el usuario elegirá el subtipo
      this.tournament.rules = this.tournament.rules || '';
    } else {
      // Deporte genérico
      this.tournament.sportSettings = {
        playersPerTeam: selectedSport.defaultPlayersPerTeam || 11,
        matchDuration: 90
      };
    }
  }

  // Cuando se selecciona un subtipo de eSport, cargar reglas por defecto
  onEsportSubtypeChange(): void {
    const subtype = this.tournament.sportSubType;
    if (subtype && this.defaultEsportRules[subtype]) {
      // poblar reglas solo si no hay reglas personalizadas previas
      this.tournament.rules = this.defaultEsportRules[subtype];
      // ajustar playersPerTeam por defecto según el juego
      if (subtype === 'valorant' || subtype === 'lol') {
        this.tournament.sportSettings = this.tournament.sportSettings || {};
        this.tournament.sportSettings.playersPerTeam = 5;
      }
      if (subtype === 'clash') {
        // dejar tal cual o ajustar si se confirma el juego
        this.tournament.sportSettings = this.tournament.sportSettings || {};
        this.tournament.sportSettings.playersPerTeam = this.tournament.sportSettings.playersPerTeam || 1;
      }
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
    // Verificar que el usuario siga autenticado
    if (!this.authService.usuarioActualValue) {
      alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente');
      this.router.navigate(['/auth/login']);
      return;
    }

    // Validar que los campos requeridos estén completos
    if (!this.validateForm()) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    this.submitting = true;
    this.submitError = null;

    // Convertir sportSettings a JSON string como espera el backend
    const sportSettingsJson = JSON.stringify({
      matchDuration: this.tournament.sportSettings?.matchDuration || 90,
      playersPerTeam: this.tournament.sportSettings?.playersPerTeam || 11,
      halves: this.tournament.sportSettings?.halves,
      overtimeEnabled: this.tournament.sportSettings?.extraTime,
      penaltiesEnabled: this.tournament.sportSettings?.penalties,
      sets: this.tournament.sportSettings?.sets,
      pointsToWin: this.tournament.sportSettings?.pointsToWin,
      substitutions: this.tournament.sportSettings?.substitutions
    });

    // Convertir fechas a formato ISO 8601 si es necesario
    const formatDateToISO = (dateStr: string): string => {
      if (!dateStr) return new Date().toISOString();
      // Si ya viene en formato datetime-local (YYYY-MM-DDTHH:mm), agregamos segundos y zona
      if (dateStr.includes('T')) {
        return new Date(dateStr).toISOString();
      }
      // Si solo es fecha (YYYY-MM-DD), agregamos hora
      return new Date(dateStr + 'T00:00:00Z').toISOString();
    };

    // Crear el payload que coincida EXACTAMENTE con el backend
    const createRequest: CreateTournamentRequest = {
      name: this.tournament.name,
      description: this.tournament.description || undefined,
      sportId: this.tournament.sport, // UUID del deporte
      sportSubType: this.tournament.sportSubType || undefined,
      tournamentType: this.tournament.tournamentType,
      category: this.tournament.category || undefined,
      eliminationMode: this.tournament.eliminationMode || undefined,
      location: this.tournament.location || undefined,
      startDate: formatDateToISO(this.tournament.startDate),
      endDate: this.tournament.endDate ? formatDateToISO(this.tournament.endDate) : undefined,
      registrationDeadline: this.tournament.endDate ? formatDateToISO(this.tournament.endDate) : undefined,
      maxTeams: this.tournament.maxTeams,
      registrationFee: this.tournament.registrationFee || 0.0,
      prizePool: this.tournament.registrationFee?.toString() || undefined,
      isPrivate: this.tournament.isPrivate,
      requiresApproval: this.tournament.requiresApproval,
      accessCode: this.tournament.accessCode || undefined,
      hasGroupStage: this.tournament.hasGroupStage,
      numberOfGroups: this.tournament.hasGroupStage ? (this.tournament.numberOfGroups || undefined) : undefined,
      teamsPerGroup: this.tournament.hasGroupStage ? (this.tournament.teamsPerGroup || undefined) : undefined,
      teamsAdvancePerGroup: this.tournament.hasGroupStage ? (this.tournament.teamsAdvancePerGroup || undefined) : undefined,
      sportSettings: sportSettingsJson,
      allowTies: this.tournament.allowTies,
      pointsForWin: this.tournament.pointsForWin,
      pointsForDraw: this.tournament.pointsForDraw,
      pointsForLoss: this.tournament.pointsForLoss,
      rulesText: this.tournament.rules || undefined
    };

    console.log('Enviando solicitud de creación:', createRequest);
    console.log('Imagen a subir:', this.tournament.image);

    // Llamar al servicio con datos e imagen
    this.tournamentService.createTournament(createRequest, this.tournament.image || null).subscribe({
      next: (tournament) => {
        console.log('Torneo creado exitosamente:', tournament);
        alert('¡Torneo creado exitosamente!');
        this.submitting = false;
        this.router.navigate(['/tournaments/detail', tournament.id]);
      },
      error: (err) => {
        console.error('Error al crear torneo:', err);
        this.submitError = 'Error al crear el torneo. Por favor, intenta de nuevo.';
        this.submitting = false;
        alert(this.submitError + '\n\nDetalle: ' + (err.error?.error || err.message || 'Error desconocido'));
      }
    });
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
