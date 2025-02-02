import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Heading from "../components/Heading";
import Input from "../components/Input";
import markerIcon from "/marker.svg";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import carIconSrc from "../assets/car.png";
import { io } from "socket.io-client";

// Initialize Socket.IO
const socket = io("ws://localhost:3001", {
  reconnectionDelayMax: 10000
});

socket.on("connect", () => {
  console.log(`Connected: ${socket.id}`);
});

let room = "all";
socket.emit("rom", room);

export default function Map({ title, track }) {
  const [carPosition, setCarPosition] = useState([28.6139, 77.209]); // Default position (Delhi)

  useEffect(() => {
    socket.on("otherloc", (data) => {
      console.log("Received location:", data);
      setCarPosition([data.lat, data.long]);
    });

    return () => {
      socket.off("otherloc");
    };
  }, []);

  // Custom marker icons
  const customMarker = new L.Icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
    shadowSize: [41, 41],
  });

  const carIcon = new L.Icon({
    iconUrl: carIconSrc,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50],
  });

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="flex xl:justify-between max-lg:flex-col-reverse justify-center items-center my-11 xl:max-w-[90%] max-xl:mx-auto max-w-screen-full">
        <div className="w-full border-black" style={{ height: "60vh" }}>
          <MapContainer
            center={carPosition}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full lg:w-[50vw] h-full z-0 border-black"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={carPosition} icon={carIcon}>
              <Popup>Car is here.</Popup>
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
