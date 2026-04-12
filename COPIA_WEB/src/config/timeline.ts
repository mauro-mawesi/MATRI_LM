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
    date: '2019',
    titleEs: 'Nos Conocimos',
    titleEn: 'We Met',
    descriptionEs: 'Un encuentro casual que cambió nuestras vidas para siempre.',
    descriptionEn: 'A casual encounter that changed our lives forever.',
    emoji: '✨',
  },
  {
    id: 'first-date',
    date: '2019',
    titleEs: 'Primera Cita',
    titleEn: 'First Date',
    descriptionEs: 'Café, risas y mariposas en el estómago.',
    descriptionEn: 'Coffee, laughs, and butterflies.',
    emoji: '☕',
  },
  {
    id: 'official',
    date: '2020',
    titleEs: 'Novios Oficialmente',
    titleEn: 'Officially Together',
    descriptionEs: '¡Por fin! Lo que todos ya sabían se hizo oficial.',
    descriptionEn: 'Finally! What everyone already knew became official.',
    emoji: '💕',
  },
  {
    id: 'moved-in',
    date: '2022',
    titleEs: 'Nuestro Primer Hogar',
    titleEn: 'Our First Home',
    descriptionEs: 'Construyendo un hogar lleno de amor (y de plantas).',
    descriptionEn: 'Building a home full of love (and plants).',
    emoji: '🏠',
  },
  {
    id: 'proposal',
    date: '2025',
    titleEs: '¡La Propuesta!',
    titleEn: 'The Proposal!',
    descriptionEs: 'Una pregunta, mil lágrimas de felicidad, y un SÍ enorme.',
    descriptionEn: 'One question, a thousand happy tears, and a big YES.',
    emoji: '💍',
  },
  {
    id: 'wedding',
    date: '2026',
    titleEs: '¡Nos Casamos!',
    titleEn: 'We Do!',
    descriptionEs: 'El día más esperado. ¡Y estás invitado/a!',
    descriptionEn: 'The most awaited day. And you are invited!',
    emoji: '🎊',
  },
];
