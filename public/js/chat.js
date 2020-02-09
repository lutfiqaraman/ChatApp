const socket = io();

socket.on("message", (message) => {
    console.log(message);
});

document.querySelector("#chat_form").addEventListener("submit", (e) => {
    e.preventDefault();

    const message = e.target.elements.message.value;
    socket.emit("sendMsg", message); 
});

document.querySelector("#send_location").addEventListener("click", () => {
    let location = new Object();

    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your broswer");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            lat: position.coords.latitude,
            lang: position.coords.longitude
        }); 
    });
});