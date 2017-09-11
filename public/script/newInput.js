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

function modalBox() {
    $("#myModal").show();
}

function removeBox() {
    $("#myModal").hide();
}

function commentModal() {
    $("#commentModal").show();
}

function removeCommentBox() {
    $("#commentModal").hide();
}
