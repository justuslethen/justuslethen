async function create_cards_by_list() {
    const data = {
        cards_list: document.querySelector("#cards_list").value,
        split_at: document.querySelector("#split_at").value,
        folder_id : get_id_from_url()
    }

    fetch(`${server_address}/add-cards-list`, {
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
            // if (data.message == "successfull created new folder") {
            // }
            window.location.href = "../" + get_id_from_url();
        })
        .catch(error => {
            console.error('error while sending request:', error);
        });
}


function evaluate_response(message) {
    // if (message === "successfull created new folder") {
    //     create_message("Der Ordner wurde erfolgreich erstellt");
    // }
}


function get_id_from_url() {
    const url = window.location.href;
    const splitet_url = url.split("/");
    const id = splitet_url[splitet_url.length - 2];

    return id
}