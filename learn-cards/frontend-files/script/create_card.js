async function add_new_card() {
    const data = {
        card_name: document.querySelector("#card_name").value,
        front: document.querySelector("#front").value,
        back: document.querySelector("#back").value,
        folder_id: get_id_from_url()
    };

    fetch(`${server_address}/add-card`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: data
        })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            evaluate_response(data.message);
        })
        .catch(error => {
            console.error('error while sending request:', error);
        });
}


function evaluate_response(message) {
    if (message === "name does already exist") {
        create_message("Es existiert bereits eine Karte mit diesem Namen");
    } else if (message === "successfull created new card") {
        create_message("Die Karte wurde erfolgreich erstellt");
    }
}


function get_id_from_url() {
    const url = window.location.href;
    const splitet_url = url.split("/");
    const id = splitet_url[splitet_url.length - 2];

    return id
}