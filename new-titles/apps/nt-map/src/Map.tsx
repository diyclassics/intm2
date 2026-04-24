import type { Acquisition } from '@nt/data/schema';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

type Props = { records: readonly Acquisition[] };

export function Map({ records }: Props) {
  return (
    <MapContainer center={[39, 22]} zoom={4} className="map">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {records.flatMap((record) =>
        record.places.map((place) => (
          <Marker key={`${record.id}:${place.id}`} position={[place.lat, place.lon]}>
            <Popup>
              <strong>{record.title}</strong>
              {record.authors.length > 0 && <div>{record.authors.join(', ')}</div>}
              <div className="muted">{place.name}</div>
            </Popup>
          </Marker>
        )),
      )}
    </MapContainer>
  );
}
