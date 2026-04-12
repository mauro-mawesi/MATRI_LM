export interface WeddingEvent {
  id: string;
  icon: string;
  time: string;
  venue: string;
  address: string;
  coordinates: [number, number]; // [lat, lng]
  mapUrl: string;
}

export const events: WeddingEvent[] = [
  {
    id: 'ceremony',
    icon: '💒',
    time: '16:00',
    venue: 'Iglesia de San Francisco',
    address: 'Calle Principal 123, Ciudad',
    coordinates: [4.6097, -74.0817], // Placeholder: Bogotá
    mapUrl: 'https://maps.google.com/?q=4.6097,-74.0817',
  },
  {
    id: 'reception',
    icon: '🎉',
    time: '18:00',
    venue: 'Hacienda Los Sueños',
    address: 'Km 5 Vía al Campo, Ciudad',
    coordinates: [4.6250, -74.0650], // Placeholder
    mapUrl: 'https://maps.google.com/?q=4.6250,-74.0650',
  },
];
