
async function pickFolder(){
    let [fileHandle] = await window.showDirectoryPicker();
    console.log(fileHandle);
    
}
    // if there are no files in selected directory
    //alert('No files in directory');


// if there is no file path for the media file folder
    //alert('No media file selected');

