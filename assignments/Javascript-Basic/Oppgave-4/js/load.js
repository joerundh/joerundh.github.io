let gaugeObjects;
let colourResult;
let hexSpan;

function hex(dec) {
    /*
    Changed a number in base 10 to base 16
    */
    let hexString = "0123456789ABCDEF";
    return `${hexString.charAt((dec - dec % 16)/16)}${hexString.charAt(dec % 16)}`;
}

function getHexCode(r, g, b) {
    /*
    Takes three components for red, green and blue in base 10
    and return the hexadecimal code
    */
    return `#${hex(r)}${hex(g)}${hex(b)}`;
}

function copyHex() {
    /*
    Copies the hex code of the current colour setting to the clipboard
    */
    navigator.clipboard.writeText(document.getElementById("colour-hex-display").innerText)
}

/*

*/
function setColour() {
    let hexCode = getHexCode(...gaugeObjects.map(gauge => gauge.getValue()));
    colourResult.style.backgroundColor = `${hexCode}`;
    hexSpan.innerText = `${hexCode}`;
}

/*
Find all divs of class "colour-picker" and insert linear integral gauges
where they have divs of class "linear-integal-gauge"
*/
Array.from(document.getElementsByClassName("colour-picker")).forEach(obj => {
    gaugeObjects = Array.from(obj.children[0].children)
        .map(el => {
            /*
            Find each div marked with a class "linear-integral-gauge"
            */
            let gauge = new LinearIntegralGauge(el.getAttribute("data-min"), el.getAttribute("data-max"), el.getAttribute("data-label"));
            obj.children[0].replaceChild(gauge.getComponent(), el);
            gauge.indicator.adjustableComponent.style.backgroundColor = `${el.getAttribute("data-colour") || "grey"}`;
            return gauge;
        });

    colourResult = Array.from(obj.children)
        .filter(el => el.className === "colour-result")[0];
    hexSpan = colourResult.children[0];

    /*
    Event listeners which allows one to tab between the colour inputs 
    in a loopy fashion
    */
    gaugeObjects.forEach((gauge, i, arr) => {
        gauge.display.inputComponent.addEventListener("keydown", event => {
            if (event.key === "Tab") {
                event.preventDefault();
                if (event.shiftKey) {
                    if (i === 0)
                        arr.at(-1).display.displayComponent.onclick({ button: 0 });
                    else
                        arr[i - 1].display.displayComponent.onclick({ button: 0 });
                } else {
                    if (i === arr.length - 1)
                        arr[0].display.displayComponent.onclick({ button: 0 });
                    else
                        arr[i + 1].display.displayComponent.onclick({ button: 0 });
                }
            }
        });
    });

    /*
    Adjust the labels of the gauges such that they have have width
    equal to that of the longest. First find which one is the longest,
    then set all to that length
    */
    let maxWidth = gaugeObjects.reduce((acc, cur) => {
        let width = cur.labelComponent.getBoundingClientRect().width;
        if (width > acc)
            return width;
        else
            return acc;
    }, 0);
    gaugeObjects.forEach(gauge => {
        gauge.labelComponent.style.width = `${maxWidth}px`;
    });

    /*
    Add event listeners such that when the value of a gauge is changed, 
    the resulting colour is viewed
    */
    gaugeObjects.forEach(gauge => {
        gauge.mainComponent.addEventListener("newvalue", event => {
            setColour();
        });
    })
});

setColour();

/*
....
....
.... this could all have been avoided with a custom element. But then
the CSS would have been less straight-forward to set, wouldn't it .......
*/