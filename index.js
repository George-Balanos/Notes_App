let inputNotesArea = document.getElementById("inputNotesArea");
let finishButton = document.getElementById("submit");
let noteWrapper = document.getElementById("note-wrapper");
let clearButton = document.getElementById("clear");
let editedNode;


finishButton.addEventListener("click", function () {
    if (!editedNode) {

        let inputTextNode = document.createElement("div");
        inputTextNode.innerText = inputNotesArea.value;
        inputTextNode.className = "noteOption";

        noteWrapper.appendChild(inputTextNode);

        inputNotesArea.value = '';

    } else {

        editedNode.innerText = inputNotesArea.value;
        editedNode = null;
        inputNotesArea.value = '';

    }

});

clearButton.addEventListener("click", function () {
    noteWrapper.innerHTML = '';
    editedNode = null;
});

noteWrapper.addEventListener("click", function (event) {

    if (event.target.className === "noteOption") {

        inputNotesArea.value = event.target.innerText;
        editedNode = event.target;

    }

})