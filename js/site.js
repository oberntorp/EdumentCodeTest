let filePathArray = 
[
    "myStartingDir/pictures/picture.png",
    "myStartingDir/pictures/movie.png",
    "dev/textdocuments/test.txt"
];
let fileListing = document.querySelector("#fileListing");
let treeView = true;

let goUppInDirectoryLevel = (event) =>
{
    event.preventDefault();
    let clickedElement = event.target;
    
    if(!hasNoSubLevel(clickedElement.parentElement))
    {
        clickedElement.parentElement.childNodes[1].remove();
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
    return Array.from(currentLiList).map(x => {
        // If icon view, firstchild will be a span for fontawsome, therefore I need to check a little differently
        let isAnchorTagInnerHtmlMatchingLinkLabel = (treeView) ? x.firstChild.innerHTML === linkLabel : x.childNodes[1].innerHTML === linkLabel; 
        if (isAnchorTagInnerHtmlMatchingLinkLabel)
            return true;
    })[0];
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
            addCurrentLocation(clickedElement.innerHTML, clickedElement.dataset.location);
        }
    }
    else
    {
        alert("You are on the deepest level in this directory listing.");
    }
}

function hasNoSubLevel(clickedElement) {
    return typeof clickedElement.childNodes[1] === "undefined";
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

    // Split occured, on . in string (file)
    if(typeof fileType !== "undefined")
    {
        switch(fileType)
        {
            case "png":
            case "jpg":
                Array("fas", "fa-file-image", "fa-2x");
                break;
            default:
                return Array("far", "fa-file-alt");
        }
    }
    else
    {
        return Array("fas", "fa-folder", "fa-2x");
    }
}

function elementWithFontAwsomeIcon(fontAwsomeClasses) 
{
    let fontAwsomeIcon = document.createElement("span");
    fontAwsomeIcon.classList.add("icon");
    fontAwsomeClasses.map(x => fontAwsomeIcon.classList.add(x));

    return fontAwsomeIcon;
}

function createAnchorTag(textAndHrefOfAnchor, directoryLevel) {
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", textAndHrefOfAnchor);
    anchorTag.setAttribute("data-level", directoryLevel);
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = textAndHrefOfAnchor;
    anchorTag.addEventListener("click", event =>
    { 
        if(treeView)
        {
            (hasNoSubLevel(event.target.parentElement)) ?  writeSubDirectoriesToGUI(event, filePathArray) : goUppInDirectoryLevel(event);
        }
        else
        {
            writeSubDirectoriesToGUI(event, filePathArray);
        }
    });

    return anchorTag;
}

function getListItemsCurrentlyAvailible(level)
{
    return document.querySelectorAll("#fileListing > ul li")[level];
}

function createSubLevel(treeBranches)
{
    let newUl = document.createElement("ul");
    for(let i = 0; i < treeBranches.paths.length; i++)
    {
        let linkLabels = treeBranches.paths[i].split("/")[0];
        
        let newLi = createListItemWithLink(linkLabels, treeBranches.lastIndexFoundNewPath);
        let currentLiList = newUl.children;
    
        if(!isLinkLabelInCurrentLiList(currentLiList, linkLabels))
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
    let anchorTag = createAnchorTag(textToItem, level);
    locationItem.appendChild(anchorTag);

    return locationItem;
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