import { useEffect, useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { events } from '../../config/events';

export default function VenueMap() {
  const { lang } = useLanguage();
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: any;
    TileLayer: any;
    Marker: any;
    Popup: any;
  } | null>(null);

  useEffect(() => {
    // Dynamic import to avoid SSR issues with Leaflet
    Promise.all([
      import('leaflet'),
      import('react-leaflet'),
    ]).then(([L, RL]) => {
      // Fix Leaflet default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });
      setMapComponents({
        MapContainer: RL.MapContainer,
        TileLayer: RL.TileLayer,
        Marker: RL.Marker,
        Popup: RL.Popup,
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="flex h-[280px] items-center justify-center rounded-3xl bg-white/50 md:h-[400px]">
        <div className="animate-pulse-soft text-midnight/40">Loading map...</div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;
  const center: [number, number] = [
    (events[0].coordinates[0] + events[1].coordinates[0]) / 2,
    (events[0].coordinates[1] + events[1].coordinates[1]) / 2,
  ];

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"
      />
      <div className="h-[280px] overflow-hidden rounded-3xl shadow-lg md:h-[400px]">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {events.map((event) => (
            <Marker key={event.id} position={event.coordinates}>
              <Popup>
                <div className="text-center">
                  <span className="text-2xl">{event.icon}</span>
                  <h3 className="font-display mt-1 text-lg font-bold">
                    {lang === 'es'
                      ? event.id === 'ceremony'
                        ? 'Ceremonia'
                        : 'Recepción'
                      : event.id === 'ceremony'
                        ? 'Ceremony'
                        : 'Reception'}
                  </h3>
                  <p className="text-sm">{event.venue}</p>
                  <p className="text-xs text-gray-500">{event.address}</p>
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-coral hover:underline"
                  >
                    Google Maps →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </>
  );
}
