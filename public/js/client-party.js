import PartySocket from "partysocket";

const partySocket = new PartySocket({
  host: window.location.host,
  room: "global-room"
});

partySocket.addEventListener("message", (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === "user-joined") {
    console.log("User joined:", data.id);
  } else if (data.type === "position-update") {
    console.log("Position update:", data.id, data.position);
  } else if (data.type === "user-left") {
    console.log("User left:", data.id);
  }
});

document.addEventListener("mousemove", (e) => {
  const position = { x: e.clientX, y: e.clientY };
  
  partySocket.send(JSON.stringify({
    type: "position-update",
    position: position
  }));
});