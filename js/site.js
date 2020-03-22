let filePathArray = 
[
    "myStartingDir/pictures/picture.png",
    "myStartingDir/movies/movie.mp4",
    "dev/textdocuments/test.txt",
    "dev/pictures/picture.png"
];
let fileListing = document.querySelector("#fileListing");
let treeView = true;

let goUppInDirectoryLevel = (event) =>
{
    event.preventDefault();
    let clickedElement = event.target;
    
    if(!nodeInTreeViewHasNoSubLevel(clickedElement.parentElement))
    {
        clickedElement.parentElement.childNodes[1].remove();
    }
    else
    {
        let subLevel = createSubLevel(getNextPath(filePathArray, clickedElement.getAttribute("href"), true));
        fileListing.replaceChild(subLevel, fileListing.firstChild);
    }
}

let changeViewType = (event, filePaths) =>
{
    treeView = event.target.value == "treeView";
    writeFilesToGUI(filePaths);
    toggleCurrentLocationBar();
}

function toggleCurrentLocationBar() 
{
    if (treeView) 
    {
        document.querySelector("header #currentLocation").className = "hide";
    }
    else if (!treeView && document.querySelector("header #currentLocation").className === "hide") 
    {
        document.querySelector("header #currentLocation").removeAttribute("class");
    }
}

let writeFilesToGUI = (filesArray) =>
{
    if(fileListingUlHasChildren())
    {
        clearFromListItems();
    }
    for(let i = 0; i < filesArray.length; i++)
    {
        toggleIconView();

        let currentLiList = document.querySelectorAll("#fileListing > ul li");
        let linkLabel = filesArray[i].split('/')[0];
        
        let currentLiListContainsLinkLabel = isLinkLabelInCurrentLiList(currentLiList, linkLabel);
        if(!currentLiListContainsLinkLabel)
            document.querySelector("#fileListing > ul").appendChild(createListItemWithLink(linkLabel, 0));
    }
}

function toggleIconView() 
{
    if (!treeView) {
        document.querySelector("#fileListing > ul").className = "iconView";
    }
    else if (treeView && document.querySelector("#fileListing > ul").className === "iconView") {
        document.querySelector("#fileListing > ul").removeAttribute("class");
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

function isLinkLabelInCurrentLiList(currentLiList, linkLabel) 
{
    for(let i = 0; i < currentLiList.length; i++)
    {
        // If icon view, first child will be a span for fontawsome, therefore the link will be the second child if iconView
        let isAnchorTagInnerHtmlMatchingLinkLabel = (treeView) ? currentLiList[i].firstChild.innerHTML === linkLabel : currentLiList[i].childNodes[1].innerHTML === linkLabel; 
        if(isAnchorTagInnerHtmlMatchingLinkLabel)
        {
            return true;
        }
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
        let subLevel = createSubLevel(pathsInDirectory);

        // If list view, else replace file listing ul with subTree
        if(treeView)
        {

            clickedElement.parentElement.appendChild(subLevel);
        }
        else
        {
            fileListing.replaceChild(subLevel, fileListing.firstChild)
            addCurrentLocation(clickedElement.innerHTML, clickedElement.dataset.level);
        }
    }
    else
    {
        alert("You are on the deepest level in this directory listing.");
    }
}

function nodeInTreeViewHasNoSubLevel(clickedElement) {
    return typeof clickedElement.childNodes[1] === "undefined";
}

function getNextPath(filesArray, oldPath, upOneLevel = false)
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
            if(upOneLevel)
            {
                pathArray.splice(0, oldPathFoundAt);
            }
            else
            {
                pathArray.splice(0, ++oldPathFoundAt);
            }

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

function createListItemWithLink(fileName, directoryLevel)
{
    let listItem = document.createElement("li");
    if(!treeView)
    {
        listItem.appendChild(elementWithFontAwsomeIcon(getTypeOfIconFromFileType(fileName)));
    }
    let anchorTag = createAnchorTag(fileName, directoryLevel);
    listItem.appendChild(anchorTag);

    return listItem;
}

function getTypeOfIconFromFileType(fileName)
{
    let fileType = fileName.split(".")[1];

    if(wasSplitSuccessfull(fileType))
    {
        switch(fileType)
        {
            case "png":
            case "jpg":
                return Array("fas", "fa-file-image", "fa-2x");
            case "mp4":
                return Array("fas", "fa-film", "fa-2x");
            default:
                return Array("far", "fa-file-alt");
        }
    }
    else
    {
        return Array("fas", "fa-folder", "fa-2x");
    }
}

function wasSplitSuccessfull(fileType) {
    return typeof fileType !== "undefined";
}

function elementWithFontAwsomeIcon(fontAwsomeClasses) 
{
    let fontAwsomeIcon = document.createElement("span");
    fontAwsomeIcon.classList.add("icon");
    fontAwsomeClasses.map(x => fontAwsomeIcon.classList.add(x));

    return fontAwsomeIcon;
}

function createAnchorTag(fileName, directoryLevel) {
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", fileName);
    anchorTag.setAttribute("data-level", directoryLevel);
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = fileName;
    anchorTag.addEventListener("click", event =>
    { 
        // If treeView, has li an ul as first child, a click on that li should close the level underneath it
        // If iconView, a click on a link should only go deeper
        if(treeView)
        {
            (nodeInTreeViewHasNoSubLevel(event.target.parentElement)) ?  writeSubDirectoriesToGUI(event, filePathArray) : goUppInDirectoryLevel(event);
        }
        else
        {
            writeSubDirectoriesToGUI(event, filePathArray);
        }
    });

    return anchorTag;
}

function createSubLevel(treeBranches)
{
    let newUl = document.createElement("ul");
    for(let i = 0; i < treeBranches.paths.length; i++)
    {
        let linkLabel = treeBranches.paths[i].split("/")[0];
        
        let newLi = createListItemWithLink(linkLabel, treeBranches.lastIndexFoundNewPath);
        let currentLiList = newUl.children;
    
        if(!isLinkLabelInCurrentLiList(currentLiList, linkLabel))
            newUl.appendChild(newLi);

        if(!treeView)
            newUl.className = "iconView";
    }

    return newUl;
}

function addCurrentLocation(text, level)
{
    let currentLocationContainer = document.querySelector("main header #currentLocation");
    currentLocationContainer.appendChild(createNewLocationItem(text, level));
}

function createNewLocationItem(textToItem, level)
{
    let locationItem = document.createElement("span");
    locationItem.className = "locationItem";
    let anchorTag = createLocationAnchorTag(textToItem, level);
    locationItem.appendChild(anchorTag);

    return locationItem;
}

function createLocationAnchorTag(textAndHrefOfAnchor, directoryLevel) {
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", textAndHrefOfAnchor);
    anchorTag.setAttribute("data-level", directoryLevel);
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = textAndHrefOfAnchor;
    anchorTag.addEventListener("click", event =>
    { 
        if(directoryLevel > 0)
        {
            goUppInDirectoryLevel(event);
            removeLastLocationItem();
        }
        else
        {
            event.preventDefault();
            writeFilesToGUI(filePathArray);
            removeAllLocationItemsExceptRoot();
        }
    });

    return anchorTag;
}

function removeLastLocationItem() 
{
    document.querySelector("header #currentLocation .locationItem:last-of-type").remove();
}

function removeAllLocationItemsExceptRoot() 
{
    let locationItems = document.querySelectorAll("header #currentLocation .locationItem");
    for(let i = 0; i < locationItems.length; i++)
    {
        if(i > 0)
        {
            locationItems[i].remove();
        }
    }
}

toggleCurrentLocationBar();
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
