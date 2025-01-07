import Heading from "../components/Heading";
import Input from "../components/Input";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Add this import


// eslint-disable-next-line react/prop-types
export default function Map({title, track}) {
  return (
    <div>
      <Heading title={title} track={track}/>
      <div className="flex justify-between items-center  my-11 xl:max-w-[90%] max-xl:mx-auto  max-w-screen-full">
        <div className="max-w-[70%] bg-black">
          <MapContainer center={[19.073987, 432.873532]} zoom={13} scrollWheelZoom={false}  style={{ height: "400px", width: "700px" }}>
  <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  <Marker position={[19.073987, 432.873532]}>
    <Popup>
      A pretty CSS3 popup. <br /> Easily customizable.
    </Popup>
  </Marker>
</MapContainer>
        
        </div>
        <div className="bg-white w-full xl:w-[20vw] h-[60vh] border-2 border-black dark:bg-gray-800 dark:border-white rounded-2xl">
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
