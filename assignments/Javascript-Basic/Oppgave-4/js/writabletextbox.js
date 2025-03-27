class WritableTextbox {
    /*
    A textbox which ORIGINALLY was supposed to be double-clicked,
    upon which text could be entered. Then someone suggested that
    a single click is enough. Which makes it a textbox which is 
    made editable by a single click, by replacing it with a 
    text input. The RESULT is in no conceivable way distinct from 
    an ordinary text input box. But, the option is there to make 
    it double-clickable instead.

    CSS is put in here with the aim to make the textbox and the 
    input box look as similar as possible, making the transition seem 
    as seamless as possible. 
    */

    constructor(min, max, width, height) {
        [ this.min, this.max ] = [ min, max ];

        this.mainComponent = document.createElement("div");
        this.mainComponent.style.width = "fit-content";
        this.mainComponent.style.height = "fit-content";

        this.displayComponent = document.createElement("div");
        this.displayComponent.innerText = `${this.min}`;
        this.displayComponent.style.width = "50px";
        this.displayComponent.style.height = "20px";
        this.displayComponent.style.fontSize = "16px";
        this.displayComponent.style.border = "1px solid black";
        this.displayComponent.style.textAlign = "center";

        this.inputComponent = document.createElement("input");
        this.inputComponent.style.width = "50px";
        this.inputComponent.style.height = "20px";
        this.inputComponent.style.fontSize = "16px";
        this.inputComponent.style.fontFamily = "Times New Roman";
        this.inputComponent.style.border = "1px solid black";
        this.inputComponent.style.outline = "none";
        this.inputComponent.style.textAlign = "center";

        /*
        If the text box is clicked, it will be replaced by a input box. 

        VERY SIMILAR to simply focusing on an input box. However, this was
        originally supposed to be a DOUBLE-CLICK event listener. But apparantly,
        front-enders consider a double-click to be too much effort.
        */
        this.displayComponent.onclick = event => {
            if (event.button === 0) {
                this.inputComponent.value = this.displayComponent.innerText;
                this.mainComponent.replaceChild(this.inputComponent, this.displayComponent);
                this.inputComponent.focus();
                this.inputComponent.select();
            }
        };

        /*
        When the input box loses focus, it will be replaced by the textbox,
        and the value considered set
        */
        this.inputComponent.onblur = event => {
            setTimeout(() => {
                if (this.inputComponent.value === "")
                    this.inputComponent.value = "0";
                this.displayComponent.innerText = this.inputComponent.value;
                if (this.mainComponent.children[0] === this.inputComponent)
                    this.mainComponent.replaceChild(this.displayComponent, this.inputComponent);
                this.mainComponent.dispatchEvent(new CustomEvent("valueset"));
            });
        }

        /*
        When using the text input:
            1. If Enter is pressed, the value is considered entered-set, and 
            the textbox is inserted in lieu of the input;
            2. If a number is entered, it is inserted where the text input
            has a selection (alt. where the cursor is); if the resulting value
            is higher than the maximum value, the maximum value is substituted;
            3. If Backspace is pressed, either the selection is deleted, or the 
            character preceeding the cursor is;
            4. If Delete is pressed, either the selection is deleted, or the 
            character following the cursor is;
            5. If any other character key is pressed, it is ignored; vee vill only
            akkzept nambers heer, ja? Genau, genau, yoah.
        */
        this.inputComponent.onkeydown = event => {
            let start = this.inputComponent.selectionStart;
            let end = this.inputComponent.selectionEnd;

            if (event.key === "Enter") {
                event.preventDefault();
                /*
                If the input box is empty, insert a zero
                */
                if (this.inputComponent.value === "")
                    this.inputComponent.value = "0";
                this.displayComponent.innerText = this.inputComponent.value;
                this.mainComponent.replaceChild(this.displayComponent, this.inputComponent);

            } else if (/^[0-9]$/.test(event.key)) {
                event.preventDefault();
                if (this.inputComponent.value === "0")
                    /*
                    Remove superfluous zero
                    */
                    this.inputComponent.value = `${event.key}`;
                else
                    this.inputComponent.value = `${this.inputComponent.value.slice(0, start)}${event.key}${this.inputComponent.value.slice(end)}`;
                this.mainComponent.dispatchEvent(new CustomEvent("valuechanged"));

            } else if (event.key === "Backspace") {
                /*
                Either remove a selected text and set the cursor to the start position
                of the selection, or remove the character just before the cursor position
                */
                event.preventDefault();
                if (start === end) {
                    this.inputComponent.value = `${this.inputComponent.value.slice(0, start - 1)}${this.inputComponent.value.slice(end)}`
                    this.inputComponent.selectionStart = start - 1;
                    this.inputComponent.selectionEnd = start - 1;
                } else {
                    this.inputComponent.value = `${this.inputComponent.value.slice(0, start)}${this.inputComponent.value.slice(end)}`;
                    this.inputComponent.selectionStart = start;
                    this.inputComponent.selectionEnd = start;
                }
                /*
                Notify that the value has been changed
                */
                this.mainComponent.dispatchEvent(new CustomEvent("valuechanged"));
            } else if (event.key === "Delete") {
                /*
                Either remove a selected text and set the cursor to the start position
                of the selection, or remove the character just after the cursor position
                */
                event.preventDefault();
                if (start === end) {
                    this.inputComponent.value = `${this.inputComponent.value.slice(0, start)}${this.inputComponent.value.slice(end + 1)}`
                    this.inputComponent.selectionStart = start;
                    this.inputComponent.selectionEnd = start;
                } else {
                    this.inputComponent.value = `${this.inputComponent.value.slice(0, start)}${this.inputComponent.value.slice(end)}`;
                    this.inputComponent.selectionStart = start;
                    this.inputComponent.selectionEnd = start;
                }
                /*
                Notify that the value has been changed
                */
                this.mainComponent.dispatchEvent(new CustomEvent("valuechanged"));
            } else if (`${event.key}`.length === 1) {
                /*
                If any other symbol is attempted to be entered, it will quietly be ignored
                */
                event.preventDefault();
            }
            /*
            Set the value to the max value if the so-far entered value exceeds it
            */
            if (this.getValue() > this.max)
                this.inputComponent.value = `${this.max}`;
        }

        this.mainComponent.append(this.displayComponent);
    }

    isActive() {
        /*
        Returns true is the inputbox is present, i.e. whether an input
        is being typed in or not.
        */
        return this.mainComponent.children[0] === this.inputComponent;
    }

    getValue() {
        /*
        Depending on isActive(), returns the value of the textbox or the 
        text input, in any case the "value" currently set.
        */
        if (this.isActive())
            return Number(this.inputComponent.value);
        else
            return Number(this.displayComponent.innerText);
    }

    setValue(value) {
        /*
        Similar to getValue, only sort of reversed
        */
        if (this.isActive())
            this.inputComponent.value = value;
        else
            this.displayComponent.innerText = value;
    }

    getComponent() {
        return this.mainComponent;
    }
}