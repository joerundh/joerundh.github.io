class LinearUnitIndicator {
    /*
    A general class for elements which by way of styling, positioning
    and event listening yields some ratio of widths.

    The value represented by the indicator at any time is 
    the ratio of the width of the adjustable and the full 
    width of the component. This is a number between 0 and 1.
    */
    constructor() {
        /*
        Shorthand functions to get the position of the main component
        */
        this.X = () => { return this.mainComponent.getBoundingClientRect().left; }
        this.Y = () => { return this.mainComponent.getBoundingClientRect().top; }
        this.width = () => { return this.mainComponent.getBoundingClientRect().width; }
        this.height = () => { return this.mainComponent.getBoundingClientRect().height; }
        
        /*
        Shorthand function to get the position of an event relative to 
        the main component
        */
        this.relX = (event) => event.clientX - this.X();
        this.relY = (event) => event.clientX - this.Y();

        /*
        Create main component and add custom default style
        */
        this.mainComponent = document.createElement("div");
        this.mainComponent.className = "linear-unit-indicator";
        this.mainComponent.style.margin = `0`;
        this.mainComponent.style.padding = `0`;
        this.mainComponent.style.boxSizing = "border-box";
        this.mainComponent.style.boxShadow = "3px 3px 3px black";
        this.mainComponent.style.width = "100px";
        this.mainComponent.style.borderRadius = "10px";
        this.mainComponent.style.height = "20px";
        this.mainComponent.style.backgroundColor = "white";
        this.mainComponent.style.display = "flex";
        this.mainComponent.style.outline = "1px solid black";
        this.mainComponent.style.overflow = "hidden";

        /*
        Create adjustable component and add custom default style
        */
        this.adjustableComponent = document.createElement("div");
        this.adjustableComponent.className = "linear-indicator-adjustable";
        this.adjustableComponent.style.width = "0";
        this.adjustableComponent.style.height = "100vh";
        this.adjustableComponent.style.backgroundColor = "grey";
        this.adjustableComponent.style.margin = "0";

        this.mainComponent.append(this.adjustableComponent);

        /*
        Events
        */
        this.mousedown = false;

        this.mainComponent.onmousedown = event => {
            /*
            When pressing a mouse button while the cursor is inside the
            indicator the adjustable should be adjusted horizontally to 
            where the cursor is. The object variable mousedown is set to 
            true, so that the adjustable will keep moving with the cursor, 
            should it be moved while inside the fluid bar.
            */
            this.mousedown = true;
            this.adjust(this.relX(event));
        };

        this.mainComponent.onmousemove = event => {
            /*
            While moving the cursor inside the indicator, if 
            mousedown is true, the adjustable should follow 
            the cursor.
            */
            if (this.mousedown) {
                this.adjust(this.relX(event));
            }
        }

        this.mainComponent.onmouseleave = event => {
            /*
            When the cursor leaves the indicator, if it crosses the bound
            at either of the ends, it means that the adjustable should
            either be set to zero width (if on the left) or maximum width
            (if on the right).
            */
            if (this.mousedown) {
                if (this.relX(event) < 0) {
                    this.adjustToZero();
                } else if (this.relX(event) > this.width() - 1) {
                    this.adjustToMax();
                }
            }
        }

        this.mainComponent.ondragenter = event => {
            /*
            If the cursor re-enters the fluid bar after having exited, 
            all the while the mouse button remains down, the fluid 
            should start following the cursor again upon re-entry.
            */
            this.mousedown = true;
        }

        this.mainComponent.onmouseup = event => {
            /*
            When a mouse button is released, the object variable mousedown 
            is set to false again, and the cursor can be moved around without
            the fluid following it. I.e., the fluid level is considered set.
            The set value is stored.
            */
            this.mousedown = false;
        };

        window.addEventListener("mouseup", event => {
            /*
            If the cursor has exited and then re-entered the fluid bar,
            while the mouse-button has remained down, the fluid will
            follow the cursor again. IF the mouse-button has been
            released, the fluid should remain still if the cursor
            enters the fluid bar again.
            */
            this.mousedown = false;
        });
    }

    adjust(newWidth) {
        this.adjustableComponent.style.width = `${newWidth}px`;
        this.mainComponent.dispatchEvent(new CustomEvent("adjusted"));
    }

    adjustToZero() {
        this.adjust(0);
    }

    adjustToMax() {
        this.adjust(this.width());
    }

    getRelativeValue() {
        /*
        Compute and return the value value of the gauge, a value between 0 and 1
        */
        return this.adjustableComponent.getBoundingClientRect().width/this.width();
    }

    setRelativeValue(value) {
        /*
        Adjusts the gauge from a given value, which must be in the interval [0, 1]
        */
        if (value >= 0 && value <= 1) {
            this.adjustableComponent.style.width = `${this.width*value}px`;
        }
    }

    setDisplay() {
        this.displayComponent.innerText = `${Math.round(this.getValue*100)/100}`;
    }

    /*
    Style functions
    */

    getComponent() {
        /*
        Returns the main DOM element
        */
        setTimeout(() => {
            this.adjustableComponent.style.top = `${this.Y()}`;
            this.adjustableComponent.style.left = `${this.X()}`;
        });
        return this.mainComponent;
    }
}

class LinearIndicator extends LinearUnitIndicator {
    /*

    */
    constructor(min, max) {
        super();
        this.min = min ? min : 0;
        this.max = max ? max : 100;

        this.mainComponent.className = "linear-indicator";
    }

    getValue() {
        return this.min + (this.max - this.min)*this.getRelativeValue();
    }

    setValue(value) {
        if (value >= 0 && value <= this.max) {
            this.setRelativeValue((value - this.min)/(this.max - this.min));
        }
    }
}

class LinearIntegralIndicator extends LinearIndicator {
    /*
    Similar as before, but the values are now taken to be always integers,
    using Math.round
    */
    constructor(min, max, width, height) {
        super(min, max, width, height);
    }

    getValue() {
        return Math.round(this.min + (this.max - this.min)*this.getRelativeValue());
    }

    setValue(value) {
        if (value >= this.min && value <= this.max) {
            this.adjustableComponent.style.width = `${this.width()*(value - this.min)/(this.max - this.min)}px`;
        }
    }
}