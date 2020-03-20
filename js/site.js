let filePathArray = 
[
    "myStartingDir/pictures/picture.png",
    "myStartingDir/movies/movie.png",
    "dev/textdocuments/test.txt"
];
let fileListing = document.querySelector("#fileListing");
let standardView = true;

let changeViewType = (event, filePaths) =>
{
    standardView = event.target.value == "treeView";
    writeFilesToGUI(filePaths);
}

let writeFilesToGUI = (filesArray) =>
{
    if(fileListingUlHasChildren())
    {
        clearFromListItems();
    }
    for(let i = 0; i < filesArray.length; i++)
    {
        let partsOfFileListingItem = filesArray[i].split('/');
        
        document.querySelector("#fileListing > ul").appendChild(createListItemWithLink(partsOfFileListingItem, 0));
    }
}

function fileListingUlHasChildren() {
    return fileListing.firstChild.hasChildNodes();
}

function clearFromListItems() {
    let childrenOfFileListingUl = document.querySelector("#fileListing > ul").childNodes;
    for(let i = childrenOfFileListingUl.length - 1; i >= 0; i--)
    {
        document.querySelector("#fileListing > ul").removeChild(childrenOfFileListingUl[i]);
    }
}

function  writeSubDirectoriesToGUI(event, filesArray)
{
    event.preventDefault();

    let clickedElement = event.target;
    let oldPath = clickedElement.getAttribute("href");

    let pathsInDirectory = getNextPath(filesArray, oldPath);
    if(!pathsInDirectory.lastPathLevelReached)
    {
        let subTree = createSubTree(pathsInDirectory);

        // If list view, else replace file listing ul with subTree
        if(standardView)
        {
            clickedElement.parentElement.appendChild(subTree);
        }
        else
        {
            fileListing.replaceChild(subTree, fileListing.firstChild)
        }
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
        lastIndexFoundNewPath: -1,
        lastPathLevelReached: false
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
            else
            {
                resultObject.lastPathLevelReached = true;
            }
        }
    }
    resultObject.lastIndexFoundNewPath = lastIndexPathFound;

    return resultObject;
}

function createListItemWithLink(partsOfFileListingItem, directoryLevel)
{
    let listItem = document.createElement("li");
    let anchorTag = createAnchorTag(partsOfFileListingItem, directoryLevel);
    listItem.appendChild(anchorTag);

    return listItem;
}

function createAnchorTag(partsOfFileListingItem, directoryLevel) {
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", partsOfFileListingItem[0]);
    anchorTag.setAttribute("data-level", directoryLevel);
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = partsOfFileListingItem[0];
    anchorTag.addEventListener("click", (event) => writeSubDirectoriesToGUI(event, filePathArray));

    return anchorTag;
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

writeFilesToGUI(filePathArray, 0);
let fileListingItemLinks = document.querySelectorAll(".fileListingItemLink");
let viewTypeSlections = document.querySelectorAll("header #viewType input");
for(let i = 0; i < viewTypeSlections.length; i++)
{
    viewTypeSlections[i].addEventListener("click", event => 
    {
        changeViewType(event, filePathArray);
    });
}