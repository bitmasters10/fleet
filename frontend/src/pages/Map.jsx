import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Heading from "../components/Heading";
import Input from "../components/Input";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import carIconSrc from "../assets/car.png";
import { io } from "socket.io-client";

// Initialize Socket.IO connection
const socket = io("ws://localhost:3001", {
  reconnectionDelayMax: 10000
});

socket.on("connect", () => {
  console.log(`Connected: ${socket.id}`);
});

// Testing room (replace with dynamic room logic later)
let room = "all";
socket.emit("joinRoom", room);

export default function Map({ title, track }) {
  const [userLocations, setUserLocations] = useState({});

  useEffect(() => {
    socket.on("otherloc", (data) => {
      console.log("Received location update:", data);

      if (data.room) {
        setUserLocations((prevLocations) => ({
          ...prevLocations,
          [data.room]: { lat: data.lat, long: data.long },
        }));
      }
    });

    return () => {
      socket.off("otherloc");
    };
  }, []);

  // Custom car icon
  const carIcon = new L.Icon({
    iconUrl: carIconSrc,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowUrl: markerShadow,
    shadowSize: [41, 41],
  });

  return (
    <div>
      <Heading title={title} track={track} />
      <div className="flex xl:justify-between max-lg:flex-col-reverse justify-center items-center my-11 xl:max-w-[90%] max-xl:mx-auto max-w-screen-full">
        <div className="w-full border-black" style={{ height: "60vh" }}>
          <MapContainer
            center={[28.6139, 77.209]} // Default view (Delhi)
            zoom={13}
            scrollWheelZoom={false}
            className="w-full lg:w-[50vw] h-full z-0 border-black"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render multiple user locations */}
            {Object.keys(userLocations).map((roomKey) => {
              const { lat, long } = userLocations[roomKey];
              return (
                <Marker key={roomKey} position={[lat, long]} icon={carIcon}>
                  <Popup>User {roomKey} is here.</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black max-xl:border-none max-xl:rounded-none dark:bg-gray-800 dark:border-white rounded-2xl">
          <h2 className="mx-4 text-3xl font-semibold px-3 pt-6">Trips</h2>
          <Input title="Trip" />
          <div className="flex items-center justify-center">
            {Object.keys(userLocations).length > 0
              ? "Tracking multiple users..."
              : "NO ONGOING TRIPS👋🏻"}
          </div>
        </div>
      </div>
    </div>
  );
}
