export interface TimelineMilestone {
  id: string;
  date: string;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  emoji: string;
}

export const milestones: TimelineMilestone[] = [
  {
    id: 'first-meet',
    date: 'Jul 2012',
    titleEs: 'Nos Conocimos',
    titleEn: 'We Met',
    descriptionEs: 'Un encuentro casual que cambió nuestras vidas para siempre.',
    descriptionEn: 'A casual encounter that changed our lives forever.',
    emoji: '✨',
  },
  {
    id: 'official',
    date: 'Dec 17, 2012',
    titleEs: 'Novios Oficialmente',
    titleEn: 'Officially Together',
    descriptionEs: '¡Por fin! Lo que todos ya sabían se hizo oficial.',
    descriptionEn: 'Finally! What everyone already knew became official.',
    emoji: '💕',
  },
  {
    id: 'first-trip-together',
    date: 'Feb 2014',
    titleEs: 'Nuestro Primer Viaje Juntos',
    titleEn: 'Our First Trip Together',
    descriptionEs: 'Mexico nos vio reír, explorar y enamorarnos aún más.',
    descriptionEn: 'Mexico saw us laugh, explore, and fall in love even more.',
    emoji: '☕',
  },
  {
    id: 'moved-in',
    date: 'Feb 2020',
    titleEs: 'Polonia Nuestro Primer Hogar',
    titleEn: 'Poland Our First Home',
    descriptionEs: 'Construyendo un hogar lleno de amor (y de plantas).',
    descriptionEn: 'Building a home full of love (and plants).',
    emoji: '🏠',
  },
  {
    id: 'proposal',
    date: 'Jun 2025',
    titleEs: '¡La Propuesta!',
    titleEn: 'The Proposal!',
    descriptionEs: 'Abu Dhabi, Una pregunta, mil lágrimas de felicidad, y un SÍ enorme.',
    descriptionEn: 'Abu Dhabi, One question, a thousand happy tears, and a big YES.',
    emoji: '💍',
  },
  {
    id: 'wedding',
    date: 'Nov 2026',
    titleEs: '¡Nos Casamos!',
    titleEn: 'We Do!',
    descriptionEs: 'El día más esperado. ¡Y estás invitado/a!',
    descriptionEn: 'The most awaited day. And you are invited!',
    emoji: '🎊',
  },
];
