/*
This script assumes that a <div> with Id "menu" is defined, and that 
a <main> element is in place with certain <div> elements that are
to be viewed and hidden depending on the menu link clicked. 
All that is really needed to line up initially is the number of labels 
for the menu links and the number of corresponding <div> elements.
It is also assumed that the labels are strings, and that the <div>
elements are placed in the HTML document in the corresponding order.
*/

let menuLinkLabels = [ "Home", "Info", "More", "About", "Contact" ];

let mainDivs;

function view(d) {
    for (let div in mainDivs) {
        if (parseInt(div) === d) mainDivs[div].style.display = "inline-block";
        else mainDivs[div].style.display = "none";
    }
 }

document.body.onload = function() {
    // Assign to array mainDivs the <div> elements of the <main> element, 
    // generate <a> elements for the menu with appropriate labels,
    // add an event listener to each one so that the right <div> is displayed
    // and the rest are hidden, and append the <a> elements to menu <div>.

    mainDivs = Array.from(document.getElementsByTagName("main")[0].children);
    let menuLink;
    for (let i in mainDivs) {
        menuLink = document.createElement("a");
        menuLink.innerHTML = menuLinkLabels[i];
        menuLink.href = "javascript:void(0);";
        menuLink.addEventListener("click", (event) => { view(parseInt(i)) });
        document.getElementById("menu").appendChild(menuLink);
    }
    view(0);
};