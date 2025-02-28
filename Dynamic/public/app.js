let btn = document.querySelector(".myloc");
let p = document.querySelector("p");
let map = L.map("mainmap").setView([28.6139, 77.2088], 15);
const socket = io("ws://172.16.233.77:3001");

socket.on("connect",()=>{
    console.log(socket.id);
})

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(map);

function showPosition(a) {
  try {
    let long = a.coords.longitude;
    let lat = a.coords.latitude;
    let myloc = [lat, long];
    console.log("loction fetched correctly");
    console.log("your latitude" + lat);
    console.log("your longitude =" + long);
    // let redIcon = L.icon({
    //   iconUrl: "green.jpeg",
    //   iconSize: [45, 100],
    //   iconAnchor: [22, 94],
    //   popupAnchor: [-3, -76],
    // });

    for (i = 1; i <= 15; i++) {
      setTimeout(() => {
        map.setView(myloc, i);
      }, 100);
    }
sendloc(lat,long)
  let mark = L.marker(myloc).addTo(map);
    mark.bindPopup("You are here.").openPopup();
    setTimeout(() => {
      mark.closePopup();
    }, 2000);
    
  } catch (e) {
    console.log("some error occur" + e);
  }
}
btn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    alert("loc not found pc old");
  }
});
let room ="all";
socket.emit("room",room )
socket.on("otherloc", (data) => {
    console.log(data);
    markcar(data.lat,data.long)
});
function sendloc(lat,long){
    socket.emit("loc",{room:room,lat:lat,long:long})
   
}
function markcar(lat,long){
    // Define the custom icon for the car
const carIcon = L.icon({
    iconUrl: 'car.png', // Replace with the actual path or URL to your icon
    iconSize: [50, 50], // Set the size of the icon (width, height)
    iconAnchor: [25, 50], // Anchor the icon to its center
    popupAnchor: [0, -50] // Position the popup above the icon
});

// Coordinates for the car marker
const carLocation = [lat, long]; // Replace with the actual coordinates

// Create the car marker with the custom icon and add it to the map
let carMarker = L.marker(carLocation, { icon: carIcon }).addTo(map);

// Optionally, bind a popup to the car marker
carMarker.bindPopup("Car is here.").openPopup();

}