const socket = io();

// Elements
const chatForm = document.querySelector("#chat_form");
const chatFormInput = chatForm.querySelector("input");
const chatFormSendButton = chatForm.querySelector("button");
const sendLocationButton = document.querySelector("#send_location");
const msgs = document.querySelector("#messages");
const url = document.querySelector("#url_location");

// Templates
const msgTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#locaion-message-template").innerHTML;

// Options
const { username, chatroom } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

socket.on("message", (message) => {
    const htmlContent = Mustache.render(msgTemplate, {
        username: message.username,
        msg: message.text,
        createdAt: moment(message.createdAt).format("HH:mm")
    });

    msgs.insertAdjacentHTML("beforeend", htmlContent);
});

socket.on("locationMsg", (urlContent) => {
    const htmlLocationLink = Mustache.render( locationTemplate, {
        username: urlContent.username,
        url: urlContent.url,
        createdAt: moment(urlContent.createdAt).format("HH:mm")
    });

    msgs.insertAdjacentHTML("beforeend", htmlLocationLink);
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

socket.emit("loginInfo", { username, chatroom }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }
});