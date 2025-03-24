function show_back() {
    console.log("show_back");
    document.querySelector("#content").style.transform = `translateY(calc(-50% - 20px))`;
}

function show_front() {
    console.log("show_front");
    document.querySelector("#content").style.transform = `translateY(0px)`;
}