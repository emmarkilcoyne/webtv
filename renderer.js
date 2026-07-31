console.log("renderer loaded");
const setMediaFolder = document.getElementById('mediaFolder');


//select media folder button
setMediaFolder.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile()
    console.log(result);
})