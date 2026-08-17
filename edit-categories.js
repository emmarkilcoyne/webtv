async function getUnsortedFiles(){

    const files = await window.electronAPI.getFiles();

    const container = document.querySelector(".unsorted-files");

    files.forEach(file => {

        console.log("Adding:", file);
        const element = document.createElement("p");

        element.className = "files";
        element.textContent = file.file;
        element.draggable = true;

        element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", file.file);
        });

        container.appendChild(element);

    });
}

async function getPlaylists(){

    const playlists = await window.electronAPI.getPlaylists();

    const container = document.querySelector(".playlists");

    container.innerHTML = "";

    const grouped = {};

    playlists.forEach(playlist => {

        if (!grouped[playlist.playlist_name]) {
            grouped[playlist.playlist_name] = [];
        }
        
        grouped[playlist.playlist_name].push(playlist.file_name);
    });
     for (const playlistName in grouped) {

        const playlistContainer = document.createElement("div");
        playlistContainer.className = "category-items";
        playlistContainer.dataset.playlist = playlistName;

        const playlistElement = document.createElement("p");
        playlistElement.className = "category-name";
        playlistElement.textContent = playlistName;

        playlistContainer.appendChild(playlistElement);

        grouped[playlistName].forEach(fileName => {

            const fileElement = document.createElement("p");
            fileElement.className = "category-files";
            fileElement.textContent = fileName;

            playlistContainer.appendChild(fileElement);
        });

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    playlistContainer.appendChild(editButton);

    container.appendChild(playlistContainer);
    }
}



function setupPlaylistDrop(){

    const playlists = document.querySelectorAll(".category-items");

    playlists.forEach(playlist => {

        playlist.addEventListener("dragover", (event) => {
            event.preventDefault();
        });


        playlist.addEventListener("drop", async (event) => {

            event.preventDefault();

            const fileName = event.dataTransfer.getData("text/plain");
            const playlistName = playlist.dataset.playlist;
           
            console.log("Adding", fileName, "to", playlistName);

            window.electronAPI.setData(playlistName, fileName);

            const unsortedFiles = document.querySelectorAll(".unsorted-files .files");

            unsortedFiles.forEach(file => {
                if (file.textContent === fileName) {
                    file.remove();
                }
            });

            await getPlaylists();
            setupPlaylistDrop();
        });

    });

}
function closePopUp(){
    const popup = document.querySelector("#playlist-popup");
    popup.style.display = "none";
}

function displayPopUp(){
    // make pop-up visible so user can type in Title of the playlist
    const popup = document.querySelector("#playlist-popup");
    popup.style.display = "block";
    
}

// get user input for playlist and media type
function addPlaylist(){
    
    // User types playlist name and selects media type from drop down (video, audio, document)
    let playlist = document.querySelector("#playlist-name").value;
    let type = document.querySelector("#media-type").value;
    window.electronAPI.createPlaylist(playlist, type);

}


async function loadPage() {
    await getUnsortedFiles();
    await getPlaylists();
    setupPlaylistDrop();
}
loadPage();
