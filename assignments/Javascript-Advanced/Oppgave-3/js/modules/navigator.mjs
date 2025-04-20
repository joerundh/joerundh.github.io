/*
A namespace which allows one to simply put different contents into different
section tags in the HTML document, declare an object with the "constructor"

    new Navigator()

This then picks up all the sections tags. One may then call the prototype function
goToSection(), passing an index as an argument, which then hides all section tags
except the one indicated by the index.

One may also define a property "data-section-title" to all section tags, the values
of which are the respective titles of the sections, and then add an element with 
the ID "section-title", whose text content is set to the relevant title whenever
goToSection is called.
*/

export function Navigator() {
    const sections = document.getElementsByTagName("section");
    const sectionTitle = document.getElementById("section-title");
    
    this.goToSection = function(index) {
        for (let element of sections) {
            element.style.display = "none";
        }
        sections[index].style.display = "flex";
        if (sectionTitle) {
            const title = sections[index].getAttribute("data-section-title");
            if (title) {
                sectionTitle.textContent = `${title}`;
            }
        }
    }
}