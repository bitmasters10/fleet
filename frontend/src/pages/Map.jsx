import Heading from "../components/Heading";
import Input from "../components/Input";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Add this import
import markerIcon from "/marker.svg";

// eslint-disable-next-line react/prop-types
export default function Map({title, track}) {
  const customMarker = new L.Icon({
    iconUrl: markerIcon,
    iconSize: [42, 42], // Adjust the size as needed
    iconAnchor: [16, 42], // Anchor the icon to its center/bottom
    popupAnchor: [0, -42], // Position the popup relative to the marker
  });
  return (
    <div>
      <Heading title={title} track={track}/>
      <div className="flex xl:justify-between max-lg:flex-col-reverse justify-center items-center   my-11 xl:max-w-[90%] max-xl:mx-auto  max-w-screen-full">
      <div className="w-full border-black" style={{ height: "60vh" }}>
  <MapContainer
    center={[19.073987, 432.873532]}
    zoom={13}
    scrollWheelZoom={false}
    className="w-full lg:w-[50vw] z-0 border-black"
    style={{ height: "60vh" }}
  >
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={[19.073987, 432.873532]}  icon={customMarker}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
</div>

        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black max-xl:border-none max-xl:rounded-none dark:bg-gray-800 dark:border-white rounded-2xl">
        <h2 className="mx-4 text-3xl font-semibold px-3 pt-6">Trips</h2>
        <Input title="Trip"/>
        <div className="flex items-center justify-center">
            NO ONGOING TRIPS👋🏻
        </div>
        </div>
      </div>
    </div>
  )
}
