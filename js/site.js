let filesArray = 
[
    "myStartingDir/pictures/picture.png",
    "myStartingDir/movies/movie.png",
    "dev/textdocuments/test.txt"
];

let writeFilesToGUI = (filesArray) =>
{
    let fileListing = document.querySelector("#fileListing");

    for(let i = 0; i < filesArray.length; i++)
    {
        let listItem = document.createElement("li");

        let partsOfFileListingItem = filesArray[i].split('/');
        
        document.querySelector("#fileListing > ul").appendChild(createListItemWithLink(partsOfFileListingItem, 0));
    }
}

function  writeSubDirectoriesToGUI(clickedElement, filesArray, oldLevel)
{
    let fileListing = document.querySelector("#fileListing");
    let oldPath = clickedElement.getAttribute("href");

    let pathsInDirectory = getNextPath(filesArray, oldPath);
    if(lastLevel(pathsInDirectory))
    {
        let subTree = createSubTree(pathsInDirectory);
        clickedElement.parentElement.appendChild(subTree);
    }
    else
    {
        alert("You are on the deepest level in this directory listing.");
    }
}

function getNextPath(filesArray, oldPath)
{
    let lastIndexPathFound = -1;
    let resultObject =
    {
        paths: [],
        lastIndexFoundNewPath: -1
    }

    for(let i = 0; i < filesArray.length; i++)
    {
        let pathArray = filesArray[i].split("/");
        let oldPathFoundAt = pathArray.indexOf(oldPath);
        if(oldPathFoundAt != -1)
        {
            pathArray.splice(0, ++oldPathFoundAt);
            if(pathArray.length > 0)
            {
                resultObject.paths.push(pathArray.join("/"));
                lastIndexPathFound = i;
            }
        }
    }
    resultObject.lastIndexFoundNewPath = lastIndexPathFound;

    return resultObject;
}

function lastLevel(paths)
{
    return paths.paths.length > 0;
}

function createListItemWithLink(partsOfFileListingItem, directoryLevel)
{
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", partsOfFileListingItem[0])
    anchorTag.setAttribute("data-level", directoryLevel)
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = partsOfFileListingItem[0];
    anchorTag.addEventListener("click", (event) => { event.preventDefault(); writeSubDirectoriesToGUI(event.target, filesArray, --directoryLevel);});
    let listItem = document.createElement("li");
    listItem.appendChild(anchorTag);

    return listItem;
}

function getListItemsCurrentlyAvailible(level)
{
    return document.querySelectorAll("#fileListing > ul li")[level];
}

function createSubTree(treeBranches)
{
    let newUl = document.createElement("ul");
    for(let i = 0; i < treeBranches.paths.length; i++)
    {
        let partsOfFileListingItem = treeBranches.paths[i].split("/");
        let newLi = createListItemWithLink(partsOfFileListingItem, treeBranches.lastIndexFoundNewPath);
        newUl.appendChild(newLi);
    }

    return newUl;
}

writeFilesToGUI(filesArray, 0);
let fileListingItemLinks = document.querySelectorAll(".fileListingItemLink");

// for(let i = 0; i < fileListingItemLinks.length; i++)
// {
//     let currentFileListingItemLink = fileListingItemLinks[i];
//     let oldLevel = Number(currentFileListingItemLink.dataset.level);
//     currentFileListingItemLink.addEventListener("click", (event) => { event.preventDefault(); writeSubDirectoriesToGUI(event.target, filesArray, oldLevel);});
// }
