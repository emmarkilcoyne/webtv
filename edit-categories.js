async function getUnsortedFiles(){

    const files = await window.electronAPI.getFiles();

    const container = document.querySelector(".unsorted-files");

    files.forEach(file => {

        console.log("Adding:", file.file_name + file.file_type);
        const element = document.createElement("p");

        element.className = "files";
        element.textContent = file.file_name + file.file_type;

        container.appendChild(element);

    });
}

getUnsortedFiles();