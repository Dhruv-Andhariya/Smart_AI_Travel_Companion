import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type Props = {
  latitude: number;
  longitude: number;
  destination: string;
};

export default function MapCard({ latitude, longitude, destination }: Props) {
  const LeafletMapContainer = MapContainer as unknown as React.ComponentType<any>;
  const LeafletTileLayer = TileLayer as unknown as React.ComponentType<any>;
  const LeafletMarker = Marker as unknown as React.ComponentType<any>;
  const LeafletPopup = Popup as unknown as React.ComponentType<any>;

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <LeafletMapContainer
        center={[latitude, longitude]}
        zoom={10}
        scrollWheelZoom={false}
        style={{
          height: "400px",
          width: "100%",
        }}
      >
        <LeafletTileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LeafletMarker position={[latitude, longitude]}>
          <LeafletPopup>{destination}</LeafletPopup>
        </LeafletMarker>
      </LeafletMapContainer>
    </div>
  );
}
