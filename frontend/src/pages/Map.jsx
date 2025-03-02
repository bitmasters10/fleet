import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Heading from "../components/Heading";
import Input from "../components/Input";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import carIconSrc from "../assets/car.png";
import { io } from "socket.io-client";
import { useTrip } from "../contexts/TripContext";

// Initialize Socket.IO connection
const socket = io("ws://localhost:3001", {
  reconnectionDelayMax: 1000000,
});

socket.on("connect", () => {
  console.log(`Connected: ${socket.id}`);
});

export default function Map({ title, track }) {
  const { currentTrips, fetchCurrentTrips } = useTrip();
  const [carPositions, setCarPositions] = useState([]);
  const joinedRooms = useRef(new Set());
  
  // Combined useEffect: fetch trips and join rooms every 30 seconds
  useEffect(() => {
    console.log("Setting up trip fetching and room joining interval...");
    
    // Function to fetch trips and join rooms
    const fetchTripsAndJoinRooms = async () => {
      console.log("Fetching trips...");
      await fetchCurrentTrips();
      
      // Clear previously joined rooms to prevent duplicate listeners
      joinedRooms.current.forEach(roomId => {
        console.log("Leaving room:", roomId);
        socket.emit("leave", roomId);
      });
      joinedRooms.current.clear();
      
      // Join new rooms
      console.log("Joining rooms for current trips...");
      currentTrips.forEach((trip) => {
        if (trip.ROOM_ID) {
          console.log("Joining room:", trip.ROOM_ID);
          socket.emit("room", trip.ROOM_ID);
          joinedRooms.current.add(trip.ROOM_ID);
        }
      });
    };
    
    // Initial fetch and join
    fetchTripsAndJoinRooms();
    
    // Set interval for both operations (30 seconds)
    const interval = setInterval(fetchTripsAndJoinRooms, 30000);
    
    return () => {
      console.log("Cleaning up fetch and join interval");
      clearInterval(interval);
      
      // Clean up by leaving all rooms
      joinedRooms.current.forEach(roomId => {
        socket.emit("leave", roomId);
      });
    };
  }, [fetchCurrentTrips, currentTrips]);

  // Listen for location updates (independent of room joining frequency)
  useEffect(() => {
    const handleLocationUpdate = (data) => {
      console.log("Received location:", data);

      setCarPositions((prevPositions) => {
        const existingIndex = prevPositions.findIndex((item) => item.room === data.room);

        if (existingIndex !== -1) {
          const updatedPositions = [...prevPositions];
          updatedPositions[existingIndex] = { ...updatedPositions[existingIndex], lat: data.lat, long: data.long };
          return updatedPositions;
        } else {
          return [...prevPositions, { room: data.room, lat: data.lat, long: data.long }];
        }
      });
    };

    socket.on("otherloc", handleLocationUpdate);

    return () => {
      socket.off("otherloc", handleLocationUpdate);
    };
  }, []);

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
            center={[19.0474975, 72.859226]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full lg:w-[50vw] h-full z-0 border-black"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {carPositions.map((car, index) => (
              <Marker key={index} position={[car.lat, car.long]} icon={carIcon}>
                <Popup>Car in room: {car.room}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black max-xl:border-none max-xl:rounded-none dark:bg-gray-800 dark:border-white rounded-2xl">
          <h2 className="mx-4 text-3xl font-semibold px-3 pt-6">Trips</h2>
          <Input title="Trip" />
          <div className="flex items-center justify-center">
            {currentTrips.length > 0 ? (
              <ul>
                {currentTrips.map((trip, index) => (
                  <li key={index}>{trip.TRIP_ID} - {trip.STAT}</li>
                ))}
              </ul>
            ) : (
              "NO ONGOING TRIPS👋🏻"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}