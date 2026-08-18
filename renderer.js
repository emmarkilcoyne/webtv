
const setMediaFolder = document.getElementById('mediaFolder');

//select media folder button
setMediaFolder.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile()
    console.log(result);

    
})


 async function generatePlaylistMenu(){

    //select menu
    const menu = document.querySelector("#menu");

    // get playlists information
    const playlists = await window.electronAPI.getPlaylistTitles();

    // for each playlist display a button
    playlists.forEach(playlist => {

        const menuElement = document.createElement("button");
        menuElement.className = "category";
        menuElement.textContent = playlist.playlist_name;

        menu.appendChild(menuElement);
        
    });
    
    
 }

 generatePlaylistMenu();

