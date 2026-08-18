

async function getUnsortedFiles(){

    // retrieve unsorted files data
    const files = await window.electronAPI.getFiles();
    const container = document.querySelector(".unsorted-files");

    files.forEach(file => {
        
        // create an element for each file
        const element = document.createElement("p");
        element.className = "files";
        element.textContent = file.file;

        // make each file draggable 
        element.draggable = true;
        element.addEventListener("dragstart", (event) => {
        event.dataTransfer.setData("text/plain", file.file);
        });

        // add file to display
        container.appendChild(element);

    });
}

async function deletePlaylist(playlist){
    await window.electronAPI.deletePlaylist(playlist);
    closeEditPopUp();
    await loadPage();

}

//gets all playlists and displays them on screen
async function getPlaylists(){

    const playlists = await window.electronAPI.getPlaylists();
    const container = document.querySelector(".playlists");
    container.innerHTML = "";
    const grouped = {};

    // group playlists by playlist name
    playlists.forEach(playlist => {

        if (!grouped[playlist.playlist_name]) {
            grouped[playlist.playlist_name] = [];
        }
        
        grouped[playlist.playlist_name].push(playlist.file_name);
    });

    // for each playlist create box with playlist files and an edit button
     for (const playlistName in grouped) {

        // create playlist container
        const playlistContainer = document.createElement("div");
        playlistContainer.className = "category-items";
        playlistContainer.dataset.playlist = playlistName;

        // add the playlists name
        const playlistElement = document.createElement("p");
        playlistElement.className = "category-name";
        playlistElement.textContent = playlistName;
        playlistContainer.appendChild(playlistElement);

        // adds playlist files
        grouped[playlistName].forEach(fileName => {

            const fileElement = document.createElement("p");
            fileElement.className = "category-files";
            fileElement.textContent = fileName;
            playlistContainer.appendChild(fileElement);

        });
    
    // Create Edit Playlist button
    // When clicked open Edit Playlist pop up
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => {
        displayEditPopup(playlistName);
    })
    playlistContainer.appendChild(editButton);
    container.appendChild(playlistContainer);
    }
}

//displays a specified playslists files
async function getPlaylistFiles(playlistName){

    // get playlists information
    const playlists = await window.electronAPI.getPlaylists();

    // select where the file information will go
    const container = document.querySelector("#playlist-content");
    container.innerHTML = "";
    
    // add each file in the playlist to the screen
    playlists.forEach(playlist => {

        if (playlist.playlist_name === playlistName) {

            const fileElement = document.createElement("p");
            fileElement.className = "edit-playlist-file";
            fileElement.textContent = playlist.file_name;

            container.appendChild(fileElement);
        }
    });
}

function setupPlaylistDrop(){
    
    const playlists = document.querySelectorAll(".category-items");

    playlists.forEach(playlist => {

        // allow files to be dragged over to playlist
        playlist.addEventListener("dragover", (event) => {
            event.preventDefault();
        });

        // handle a file being dropped into playlist
        playlist.addEventListener("drop", async (event) => {

            event.preventDefault();
            // get file name
            const fileName = event.dataTransfer.getData("text/plain");
            // get playlist name
            const playlistName = playlist.dataset.playlist;
           
            // add the file to the playlists table
            window.electronAPI.setData(playlistName, fileName);

            // find the file in the unsorted files list
            const unsortedFiles = document.querySelectorAll(".unsorted-files .files");

            // remove the file from the unsorted files list
            unsortedFiles.forEach(file => {
                if (file.textContent === fileName) {
                    file.remove();
                }
            });

            // refresh playlists to reflect changes and reconnect drag and drop listeners
            await getPlaylists();
            setupPlaylistDrop();

        });

    });

}

async function displayEditPopup(playlistName){

    //make the edit playlist popup visible
    const popup = document.querySelector("#edit-popup")
    popup.style.display = "block";

    //show the name of the playlist
    const name = document.querySelector("#playlist-title");
    name.textContent = playlistName;

    //show the files of the playlist
    await getPlaylistFiles(playlistName);

}
function closeEditPopUp(){

    //close the pop up
    const popup = document.querySelector("#edit-popup");
    popup.style.display = "none";

}

function closeCreatePopUp(){

    //close the pop up
    const popup = document.querySelector("#create-popup");
    popup.style.display = "none";
}
function displayCreatePopUp(){

    // make the create playlist pop up visible
    const popup = document.querySelector("#create-popup");
    popup.style.display = "block";
}

// get user input for playlist and media type
async function addPlaylist(){
    
    // User types playlist name and selects media type from drop down (video, audio, document)
    let playlist = document.querySelector("#playlist-name").value;
    let type = document.querySelector("#media-type").value;
    await window.electronAPI.createPlaylist(playlist, type);
    closeCreatePopUp();
    await getPlaylists();
    setupPlaylistDrop();

}


async function loadPage() {
    await getUnsortedFiles();
    await getPlaylists();
    setupPlaylistDrop();
}
loadPage();
