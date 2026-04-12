export const es = {
  // Navbar
  'nav.home': 'Inicio',
  'nav.story': 'Nuestra Historia',
  'nav.events': 'Eventos',
  'nav.gallery': 'Galería',
  'nav.rsvp': 'Confirmar',
  'nav.gifts': 'Mesa de Regalos',
  'nav.music': 'Música',

  // Hero
  'hero.subtitle': '¡Nos casamos!',
  'hero.invited': 'ESTÁS INVITADO',
  'hero.toWedding': 'A CELEBRAR NUESTRA BODA',
  'hero.description': 'Acompáñanos en un día lleno de amor, risas y recuerdos inolvidables.',
  'hero.day': 'SÁBADO',
  'hero.dateShort': '14 NOV',
  'hero.year': '2026',
  'hero.time': '4:30 PM',
  'hero.venue': 'CENTRO DE EVENTOS INTI RAIMI',
  'hero.address': 'Salon Premium Inti Raimi, km 1, Vía Puerto Tejada',
  'hero.closing': 'No podemos esperar a celebrar contigo.',
  'hero.date': '14 de Noviembre, 2026',
  'hero.cta': 'Confirmar Asistencia',
  'hero.scroll': 'Descubre nuestra historia',

  // Countdown
  'countdown.title': 'Cuenta Regresiva',
  'countdown.days': 'Días',
  'countdown.hours': 'Horas',
  'countdown.minutes': 'Minutos',
  'countdown.seconds': 'Segundos',
  'countdown.passed': '¡Ya nos casamos!',

  // Love Story
  'story.title': 'Nuestra Historia de Amor',
  'story.subtitle': 'El camino que nos trajo hasta aquí',

  // Events
  'events.title': 'Celebremos Juntos',
  'events.ceremony': 'Ceremonia',
  'events.ceremony.time': '4:00 PM',
  'events.ceremony.description': 'Acompáñanos en este momento tan especial donde uniremos nuestras vidas.',
  'events.reception': 'Recepción',
  'events.reception.time': '6:00 PM',
  'events.reception.description': '¡A celebrar! Cena, baile y mucha diversión.',
  'events.dresscode': 'Código de vestimenta',
  'events.dresscode.value': 'Casual Elegante',
  'events.map': 'Ver en el Mapa',

  // Gallery
  'gallery.title': 'Momentos que Atesoramos',
  'gallery.subtitle': 'Un vistazo a nuestra historia juntos',

  // RSVP
  'rsvp.title': '¿Vienes a la Fiesta?',
  'rsvp.subtitle': 'Confirma tu asistencia antes del 14 de Octubre, 2026',
  'rsvp.name': 'Nombre completo',
  'rsvp.email': 'Correo electrónico',
  'rsvp.attending': '¿Asistirás?',
  'rsvp.attending.yes': '¡Sí, ahí estaré!',
  'rsvp.attending.no': 'No podré asistir',
  'rsvp.guests': 'Número de acompañantes',
  'rsvp.dietary': 'Restricciones alimentarias',
  'rsvp.dietary.placeholder': 'Vegetariano, vegano, alergias...',
  'rsvp.message': 'Mensaje para los novios',
  'rsvp.message.placeholder': 'Déjanos unas palabras bonitas...',
  'rsvp.submit': 'Confirmar Asistencia',
  'rsvp.submitting': 'Enviando...',
  'rsvp.success.title': '¡Confirmado!',
  'rsvp.success.message': 'Gracias por confirmar. ¡Nos vemos en la fiesta!',
  'rsvp.error': 'Hubo un error. Por favor intenta de nuevo.',

  // Gifts
  'gifts.title': 'Mesa de Regalos',
  'gifts.subtitle': 'Tu presencia es nuestro mejor regalo, pero si deseas obsequiarnos algo...',
  'gifts.view': 'Ver Tienda',

  // Music
  'music.title': 'La Playlist de la Fiesta',
  'music.subtitle': '¿Qué canción no puede faltar?',
  'music.song': 'Nombre de la canción',
  'music.artist': 'Artista',
  'music.submit': 'Sugerir Canción',
  'music.thanks': '¡Gracias por tu sugerencia!',
  'music.recent': 'Sugerencias recientes',

  // Footer
  'footer.made': 'Hecho con',
  'footer.by': 'por Laura & Mauro',
  'footer.hashtag': '#LauraYMauro2026',

  // Accessibility
  'a11y.langToggle': 'Cambiar idioma',
  'a11y.soundToggle': 'Activar/desactivar sonido',
  'a11y.menu': 'Abrir menú',
  'a11y.closeMenu': 'Cerrar menú',
} as const;

export type TranslationKey = keyof typeof es;
