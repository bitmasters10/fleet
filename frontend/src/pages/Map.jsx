import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Heading from "../components/Heading";
import Input from "../components/Input";
import markerIcon from "/marker.svg";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// eslint-disable-next-line react/prop-types
export default function Map({ title, track }) {
  // Create custom marker icon
  const customMarker = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow, // Add shadow for better visibility
    iconSize: [42, 42],
    iconAnchor: [21, 42], // Center bottom of icon (half of iconSize[0], full iconSize[1])
    popupAnchor: [0, -42], // Center top of icon
    shadowSize: [41, 41], // Standard shadow size
  });

  // Using valid coordinates (example: New Delhi, India)
  const position = [28.6139, 77.209];

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="flex xl:justify-between max-lg:flex-col-reverse justify-center items-center my-11 xl:max-w-[90%] max-xl:mx-auto max-w-screen-full">
        <div className="w-full border-black" style={{ height: "60vh" }}>
          <MapContainer
            center={position}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full lg:w-[50vw] h-full z-0 border-black"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position} icon={customMarker}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          </MapContainer>
        </div>

        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black max-xl:border-none max-xl:rounded-none dark:bg-gray-800 dark:border-white rounded-2xl">
          <h2 className="mx-4 text-3xl font-semibold px-3 pt-6">Trips</h2>
          <Input title="Trip" />
          <div className="flex items-center justify-center">
            NO ONGOING TRIPS👋🏻
          </div>
        </div>
      </div>
    </div>
  );
}
