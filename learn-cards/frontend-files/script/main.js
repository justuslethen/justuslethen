const server_address = "http://192.168.178.144:4211";
let message_id = 0;

function create_message(message) {
    message_id++;
    document.body.innerHTML += `
    <div class="message" id="message_${message_id}">
        <p>${message}</p>
    </div>
    `;
    const id = message_id;
    setTimeout(() => {
        console.log(id);
        document.querySelector(`#message_${id}`).remove();
    }, 3000);

}