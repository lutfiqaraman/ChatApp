const socket = io();

const chatForm = document.querySelector("#chat_form");
const chatFormInput = chatForm.querySelector("input");
const chatFormSendButton = chatForm.querySelector("button");
const sendLocationButton = document.querySelector("#send_location");

socket.on("message", (message) => {
    console.log(message);
});

chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    chatFormSendButton.setAttribute("disabled", "disabled");

    const message = e.target.elements.message.value;
    socket.emit("sendMsg", message, (message) => {
        chatFormSendButton.removeAttribute("disabled");
        chatFormInput.value = "";
        chatFormInput.focus();
        console.log(message);
    }); 
});

sendLocationButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your broswer");
    }

    sendLocationButton.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("sendLocation", {
            lat: position.coords.latitude,
            lang: position.coords.longitude
        }, () => {
            sendLocationButton.removeAttribute("disabled");
            console.log("Location is shared ...");
        }); 
    });
});