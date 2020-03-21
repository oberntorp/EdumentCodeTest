let filePathArray = 
[
    "myStartingDir/pictures/picture.png",
    "myStartingDir/pictures/movie.png",
    "dev/textdocuments/test.txt"
];
let fileListing = document.querySelector("#fileListing");
let treeView = true;

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
        let linkLabels = filesArray[i].split('/');
        
        let currentLiListContainsLinkLabel = isLinkLabelInCurrentLiList(currentLiList, linkLabels);
        if(!currentLiListContainsLinkLabel)
            document.querySelector("#fileListing > ul").appendChild(createListItemWithLink(linkLabels, 0));
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
        let isAnchorTagInnerHtmlMatchingLinkLabel = (treeView) ? x.firstChild.innerHTML === linkLabel[0] : x.childNodes[1].innerHTML === linkLabel[0] 
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
        let subTree = createSubTree(pathsInDirectory);

        // If list view, else replace file listing ul with subTree
        if(treeView)
        {
            clickedElement.parentElement.appendChild(subTree);
        }
        else
        {
            fileListing.replaceChild(subTree, fileListing.firstChild)
            addCurrentLocation(clickedElement.innerHTML);
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
    if(!treeView)
    {
        listItem.appendChild(elementWithFontAwsomeIcon());
    }
    let anchorTag = createAnchorTag(partsOfFileListingItem, directoryLevel);
    listItem.appendChild(anchorTag);

    return listItem;
}

function elementWithFontAwsomeIcon() 
{
    let fontAwsomeIcon = document.createElement("span");
    fontAwsomeIcon.classList.add("icon", "fas", "fa-folder", "fa-2x");

    return fontAwsomeIcon;
}

function createAnchorTag(textAndHrefOfAnchor, directoryLevel) {
    let anchorTag = document.createElement("a");
    anchorTag.setAttribute("href", textAndHrefOfAnchor[0]);
    anchorTag.setAttribute("data-level", directoryLevel);
    anchorTag.className = "fileListingItemLink";
    anchorTag.innerHTML = textAndHrefOfAnchor[0];
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
        let linkLabels = treeBranches.paths[i].split("/");
        
        let newLi = createListItemWithLink(linkLabels, treeBranches.lastIndexFoundNewPath);
        let currentLiList = newUl.children;
    
        if(!isLinkLabelInCurrentLiList(currentLiList, linkLabels))
            newUl.appendChild(newLi);

        if(!treeView)
            newUl.className = "iconView";
    }

    return newUl;
}

function addCurrentLocation(text)
{
    let currentLocationContainer = document.querySelector("main header #currentLocation");
    currentLocationContainer.appendChild(createNewLocationItem(text));
}

function createNewLocationItem(textToItem)
{
    let locationItem = document.createElement("span");
    locationItem.className = "locationItem";
    let textNode = document.createTextNode(textToItem);
    locationItem.appendChild(textNode);

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