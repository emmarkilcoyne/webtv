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


function setupPlaylistDrop(){

    const playlists = document.querySelectorAll(".category-items");

    playlists.forEach(playlist => {

        playlist.addEventListener("dragover", (event) => {
            event.preventDefault();
        });


        playlist.addEventListener("drop", (event) => {

            event.preventDefault();

            const fileName = event.dataTransfer.getData("text/plain");
            //const playlistName = playlist.dataset.playlist;
             let playlistName = "Movies"

            console.log("Adding", fileName, "to", playlistName);

            window.electronAPI.setData(playlistName, fileName);

        });

    });

}




getUnsortedFiles();
setupPlaylistDrop();