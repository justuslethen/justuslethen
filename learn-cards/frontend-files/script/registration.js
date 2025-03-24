let password_listener = document.querySelector("#password").addEventListener("input", () => {
    set_password_length_bar_width();
});


function set_password_event_listener() {
    document.querySelector("#password").removeEventListener("input", set_password_length_bar_width, true);

    password_listener = document.querySelector("#password").addEventListener("input", () => {
        set_password_length_bar_width();
    });
}


function set_password_length_bar_width() {
    const length = document.querySelector("#password").value.length;
    const bar = document.querySelector("#bar_inner");
    value = length / 6;

    if (value > 1) {
        value = 1;
    }

    bar.style.width = `${value * 100}%`;
    bar.setAttribute("value", value);
}


async function create_new_account() {
    const data = {
        username: document.querySelector("#username").value,
        password: document.querySelector("#password").value
    };

    fetch(`${server_address}/registration`, {
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
            set_password_event_listener();
            set_password_length_bar_width();
        })
        .catch(error => {
            console.error('error while sending request:', error);
        });
}


function evaluate_response(message) {
    if (message === "successfull created new account") {
        window.location.href = "/login";
    } else if (message === "short password") {
        const input_tip = document.querySelector("#password_input_tip");
        input_tip.style.animation = "shake 500ms";
        setTimeout(() => {
            input_tip.removeAttribute("style");
        }, 600);
        create_message("Das Passwort ist zu kurz");
    } else if (message === "username already exists") {
        create_message("Nutzername existiert bereits");
    }
}