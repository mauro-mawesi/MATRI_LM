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
    id: 'ceremony-reception',
    icon: '✨',
    time: '16:30',
    venue: 'CENTRO DE EVENTOS INTI RAIMI',
    address: 'Salon Premium Inti Raimi, km 1, Vía Puerto Tejada',
    coordinates: [3.35, -76.45], // Placeholder coordinates matching the region roughly
    mapUrl: 'https://maps.google.com/?q=Centro+De+Eventos+Inti+Raimi',
  }
];
