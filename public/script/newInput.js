function newInput() {
    if (document.getElementById("newImage").checked == true) { 
        var input = document.createElement("INPUT");
        input.setAttribute("class", "form-control");
        input.setAttribute("type", "file");
        input.setAttribute("name", "updatedImage");
        document.getElementById("newInput").appendChild(input);
    }
}

function removeInput() {
    if (document.getElementById("currentImage").checked == true) {
        $("#newInput").empty();
    }
}

