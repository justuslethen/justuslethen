async function login_user() {
    const data = {
        username: document.querySelector("#username_input").value,
        password: document.querySelector("#password_input").value
    };

    fetch(`${server_address}/login`, {
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
            evaluate_response(data);
        })
        .catch(error => {
            console.error('error while sending request:', error);
        });
}


function evaluate_response(data) {
    if (data) {
        if (data.message === "incorrect password") {
            create_message("Das Passwort ist falsch");
        } else if (data.message === "user does not exist") {
            create_message("Der Nutzer existiert nicht");
        } else {
            window.location.href = "/";
        }
    } else {
        window.location.href = "/";
    }
}