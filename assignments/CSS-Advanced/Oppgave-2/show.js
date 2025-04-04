const headerElement = document.getElementsByTagName("header")[0];
const mainElement = document.getElementsByTagName("main")[0];
const footerElement = document.getElementsByTagName("footer")[0];
const h1 = document.getElementsByTagName("h1");
const showButton = footerElement.children[0];

function showListener() {
    const h1 = document.createElement("h1");
    h1.textContent = headerElement.textContent + " by explaining lenitions in Irish";
    
    headerElement.remove();
    footerElement.remove();
    mainElement.prepend(h1);
    mainElement.style.display = "flex";
    showButton.removeEventListener("click", showListener);
}

showButton.addEventListener("click", showListener);