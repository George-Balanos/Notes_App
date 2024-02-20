document.addEventListener('DOMContentLoaded', () => {

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

            saveNote(inputTextNode.innerText);

            inputNotesArea.value = '';

        } else {

            editedNode.innerText = inputNotesArea.value;

            //saveNote(editedNode.innerText);

            editedNode = null;
            inputNotesArea.value = '';

        }

    });

    clearButton.addEventListener("click", function () {
        noteWrapper.innerHTML = '';
        editedNode = null;

        const deleteRequest = indexedDB.deleteDatabase('NotesDB');

        deleteRequest.onerror = (event) => {
            console.log('Error appeared on database delete', event.target.error);
        };

        deleteRequest.onsuccess = (event) => {
            console.log("Database was deleted successfully");
        };

    });

    noteWrapper.addEventListener("click", function (event) {

        if (event.target.className === "noteOption") {

            inputNotesArea.value = event.target.innerText;
            editedNode = event.target;

        }

    });

    ///////////////

    let db;

    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('NotesDB', 1);

            request.onerror = (event) => {
                reject('Error while opeing the database');
            };

            request.onsuccess = (event) => {
                db = event.target.result;
                resolve('Database opened successfully');
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                const store = database.createObjectStore('NotesStore', { keyPath: 'id', autoIncrement: true });
                store.createIndex('content', 'content', { unique: false });
            };
        });
    }

    function saveNote(content) {
        const transaction = db.transaction('NotesStore', 'readwrite');
        const store = transaction.objectStore('NotesStore');
        const note = { content };

        store.add(note);
    }

    function loadNotes() {
        const transaction = db.transaction('NotesStore', 'readonly');
        const store = transaction.objectStore('NotesStore');
        const cursor = store.openCursor();

        cursor.onsuccess = (event) => {
            const cursor = event.target.result;

            if (cursor) {
                const noteContent = cursor.value.content;

                if (noteContent === '') {
                    cursor.continue();
                } else {
                    const noteElement = document.createElement("div");
                    noteElement.innerText = noteContent;
                    noteElement.className = "noteOption";
                    noteWrapper.appendChild(noteElement);
                    cursor.continue();
                }

            }
        };

    }

    openDB().then(() => {
        // Load existing notes
        loadNotes();
    }).catch(error => {
        console.error(error);
    });

});
