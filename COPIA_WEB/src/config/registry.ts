export interface GiftStore {
  id: string;
  nameEs: string;
  nameEn: string;
  descriptionEs: string;
  descriptionEn: string;
  url: string;
  icon: string;
}

export const giftStores: GiftStore[] = [
  {
    id: 'falabella',
    nameEs: 'Falabella',
    nameEn: 'Falabella',
    descriptionEs: 'Nuestra lista de regalos principal',
    descriptionEn: 'Our main gift registry',
    url: 'https://www.falabella.com',
    icon: '🎁',
  },
  {
    id: 'cash',
    nameEs: 'Luna de Miel',
    nameEn: 'Honeymoon Fund',
    descriptionEs: 'Contribuye a nuestra luna de miel soñada',
    descriptionEn: 'Contribute to our dream honeymoon',
    url: '#',
    icon: '✈️',
  },
  {
    id: 'amazon',
    nameEs: 'Amazon',
    nameEn: 'Amazon',
    descriptionEs: 'Lista alternativa de regalos',
    descriptionEn: 'Alternative gift list',
    url: 'https://www.amazon.com',
    icon: '📦',
  },
];
