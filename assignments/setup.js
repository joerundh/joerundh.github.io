function generateMenuItem(sectionIndex, sectionObject) {
    let buttonElement = document.createElement("button");
    if (sectionIndex === -1) buttonElement.innerHTML = "View all";
    else buttonElement.innerHTML = `${sectionIndex + 1} ${sectionObject.sectionName}`;
    buttonElement.addEventListener("click", (event) => {
        viewContent(sectionIndex);
    });
    return buttonElement;
}

function generateSectionList(sectionIndex, sectionObject) {
    let divElement = document.createElement("div");
    divElement.id = `section${sectionIndex + 1}`;

    let headerElement = document.createElement("h2");
    headerElement.innerHTML = `${sectionIndex + 1} ${sectionObject.sectionName}`;
    divElement.appendChild(headerElement);

    if (sectionObject.items.length === 0) {
        let p = document.createElement("p");
        p.innerHTML = "No items."
    } else {
        let listElement = document.createElement("ul");

        sectionObject.items.forEach((item, itemIndex) => {
            let listItem = document.createElement("li");
            listItem.style.listStyleType = "square";

            let aElement = document.createElement("a");
            aElement.href = `./${item.folderName}`;
            aElement.target = "_blank";
            aElement.innerHTML = `${sectionIndex + 1}.${itemIndex + 1} ${item.title}`;
            listItem.appendChild(aElement);

            let copyElement = document.createElement("a");
            copyElement.href="javascript:void(0);";
            copyElement.title = "Copy URL";
            copyElement.addEventListener("click", (event) => {
                navigator.clipboard.writeText(`https://joerundh.github.io/assignments/${item.folderName}/`);
            });
            copyElement.innerHTML = "&#x1f5d0;";
            listItem.appendChild(copyElement);

            listElement.appendChild(listItem);
        });

        divElement.appendChild(listElement);
    }

    return divElement;
}

let loadPage = async (event) => {
    window.removeEventListener("load", loadPage, false);

    let menuDiv = document.getElementById("menu");
    let contentDiv = document.getElementById("content");

    menuDiv.appendChild(generateMenuItem(-1));

    let content = await fetch("./directory.json")
        .then(response => response.json());

    content.forEach((obj, index) => {
        contentDiv.appendChild(generateSectionList(index, obj));
        menuDiv.appendChild(generateMenuItem(index, obj));
    });
}
window.addEventListener("load", loadPage, false);

function viewContent(sectionIndex) {
    document.getElementById("content").childNodes.forEach((sectionDiv, index) => {
        if (sectionIndex === -1 || index === sectionIndex) {
            sectionDiv.style.display = "inline-block";
        } else {
            sectionDiv.style.display = "none";
        }
    });
}
