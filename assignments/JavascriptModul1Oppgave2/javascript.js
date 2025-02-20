/******************************************************************************
Funksjoner og metoder oppgave

Les oppgaveteksten NØYE. Vis noen eksempler i koden din som tester
funksjonene og metodene dine. Bruk en variasjon av pilfunksjoner (arrow functions)
og funksjoner laget med nøkkelordet `function`.

Legg til kommentarer i koden din som kort forklarer hva den gjør.

******************************************************************************/

/******************************************************************************
1.

Lag følgende funksjon:

Funksjonen skal ta inn et tall som parameter og returnere
"Oddetall" hvis tallet er et oddetall og "Partall" hvis tallet er et partall.
(PS: Funksjonen skal bruke return, du skal ikke bruke console log inni
funksjonen)

******************************************************************************/

let isOddOrEven = function(num) {
    if (typeof num !== "number") return "Ikke talltype";
    if (Math.round(num) !== num) return "Ikke heltall";
    return num % 2 ? "Oddetall" : "Partall";
}

console.log("");
console.log("--OPPGAVE 1--");
console.log("");

console.log(isOddOrEven(3));
console.log(isOddOrEven(8));
console.log(isOddOrEven(23242));
console.log(isOddOrEven(39834953371));
console.log(isOddOrEven(2.4));
console.log(isOddOrEven("356"));

/******************************************************************************
2.

Lag følgende funksjon:

Funksjonen skal ta inn en string som parameter og returnere stringen
i STORE BOKSTAVER med et utropstegn på slutten.

Eksempel: "Dette er kult" skal returnere "DETTE ER KULT!"

******************************************************************************/

function capitalize(str) {
    if (typeof str !== "string") return "DET SKAL VÆRE EN TEKSTSTRENG!";
    let newStr = str.trim();
    while (newStr.at(-1) === "." || newStr.at(-1) === "?") newStr = newStr.substring(0, newStr.length - 1);
    return `${newStr.toUpperCase()}${newStr.at(-1) === "!" ? "" : "!"}`;
}

console.log("");
console.log("--OPPGAVE 2--");
console.log("");

console.log(capitalize("Dette er en tekststreng."));
console.log(capitalize("Neimen om ikke også dette er en tekststreng."));
console.log(capitalize("DET VAR FÆLT SÅ MANGE TEKSTSTRENGER DA!"));


/******************************************************************************
3.

Lag følgende funksjon:

Funksjonen skal ta inn 2 parametere:

 - Et navn (string)
 - En time på døgnet (nummer)

Funksjonen skal returnere:
"Ugyldig tid" hvis timeverdien er mindre enn 0.
"God natt (mottatt navn)" hvis timeverdien er mellom 0 og 5.
"God morgen (mottatt navn)" hvis timeverdien er mellom 6 og 11.
"God dag (mottatt navn)" hvis timeverdien er mellom 12 og 17.
"God kveld (mottatt navn)" hvis timeverdien er mellom 18 og 23.
"Ugyldig tid" hvis timeverdien er større enn 23.

Hvis ingen timeverdi mottas, skal funksjonen returnere en feilmelding.

******************************************************************************/

function timeMessage(name, time) {
    if (Math.round(time) !== time || time < 0 || time > 23) return "Ugyldig tid";
    if (time < 6) return `God natt, ${name}`;
    if (time < 12) return `God morgen, ${name}`;
    if (time < 18) return `God dag, ${name}`;
    return `God kveld, ${name}`;
}

console.log("");
console.log("--OPPGAVE 3--");
console.log("");

console.log(timeMessage("hr. Casement", 2.718181828));
for (let t = -4; t < 25; t++) {
    console.log(`Tid: ${t} - ${timeMessage("hr. Casement", t)}`);
}

/******************************************************************************
4.

Lag følgende funksjon:

Funksjonen skal ta inn en array som parameter og returnere arrayen
med første og siste indeks fjernet.

Eksempel 1: ["Rød", "Grønn", "Blå", "Gul"] skal returnere ["Grønn", "Blå"].

Eksempel 2: ["En", "To", "Tre", "Fire", "Fem", "Seks"] skal returnere
["To", "Tre", "Fire", "Fem"].

******************************************************************************/

function trimArray(arr) {
    if (!Array.isArray(arr)) return null;
    if (arr.length < 3) return [];
    return arr.slice(1, arr.length - 1);
}

console.log("");
console.log("--OPPGAVE 4--");
console.log("");

console.log(trimArray([]));
console.log(trimArray([0]));
console.log(trimArray([0, 1]));
console.log(trimArray([0, 1, 2]));
console.log(trimArray([0, 1, 2, 3, 4, 5, 6]));
console.log(trimArray(["Rød", "Grønn", "Blå", "Gul"]));
console.log(trimArray(["En", "To", "Tre", "Fire", "Fem", "Seks"]));

/******************************************************************************
5.

Lag følgende funksjon:

Funksjonen skal ta inn en string som parameter.

Bruk stringmetoder på stringen for å gjøre følgende:
 - Erstatt ordet "vanskelig" med "gøy".
 - Fjern mellomrom fra starten og slutten av stringen.

Returner deretter den oppdaterte stringen.

Eksempel 1: "  Javascript er vanskelig   " skal returnere "Javascript er gøy".
Eksempel 2: " Det er vanskelig å bruke metoder " skal returnere "Det er gøy å bruke metoder".
Eksempel 3: "   vanskelig        " skal returnere "gøy".

******************************************************************************/

function changeAttitude(str) {
    return str.trim().replaceAll("vanskelig", "gøy");
}

console.log("");
console.log("--OPPGAVE 5--");
console.log("");

console.log(changeAttitude("  Javascript er vanskelig   "));
console.log(changeAttitude(" Det er vanskelig å bruke metoder "));
console.log(changeAttitude("   vanskelig        "));

/******************************************************************************
6.

Fullfør følgende steg for å manipulere "items"-arrayet. Hvert steg skal
fullføres ved å bruke passende array-metoder.

*******************************************************************************/

const items = ["Bok", "Penn", "Notatbok", "Viskelær", "Blyant", "Markør"];

/*******************************************************************************
Steg 1: Fjern det første elementet ("Bok") fra arrayen ved hjelp av riktig metode.

Steg 2: Finn og erstatt "Viskelær" med "Linjal" i arrayen.

Steg 3: Bruk splice-metoden til å fjerne både "Penn" og "Notatbok", og legg til "Markeringspenn" i deres plass.

Steg 4: Kombiner alle elementene i arrayen til en enkelt string ved å bruke " | " som separator.

Ekstra utfordring: Lag et nytt array som kun inkluderer elementer som inneholder bokstaven "e".

******************************************************************************/

console.log("");
console.log("--OPPGAVE 6--")
console.log("");

console.log(items);

// Steg 1
items.splice(0, 1);
console.log(items)

// Steg 2
while (items.includes("Viskelær")) items[items.indexOf("Viskelær")] = "Linjal";
console.log(items);

// Steg 3
for (let i in items) {
    if (["Penn", "Notatbok"].includes(items[i])) items.splice(i, 1, "Markeringspenn");
}
console.log(items);

// Steg 4
let itemStr = items.join("|");
console.log(itemStr);

// Ekstra utfordring

let eItems = items.filter((item) => item.includes("e"));
console.log(eItems);

/******************************************************************************
7.

EKSTRA UTFORDRING #1:

Dette er ikke obligatorisk, kun for de som vil ha en ekstra utfordring.

Lag følgende funksjon:

Funksjonen skal ta inn 2 parametere, en array og en string.

Sjekk om arrayen inneholder stringen. Hvis den gjør det, fjern elementet
fra arrayet og returner den oppdaterte arrayen.

Hvis arrayet ikke inneholder stringen, legg stringen til på slutten
av arrayet og returner det oppdaterte arrayet.

Eksempel 1: (["Rød", "Grønn"], "Blå") --> ["Rød", "Grønn", "Blå"]
Eksempel 2: (["Rød", "Grønn", "Blå"], "Grønn") --> ["Rød", "Blå"]
Eksempel 3: (["En", "To", "Tre"], "Fire") --> ["En", "To", "Tre", "Fire"]
Eksempel 4: (["En", "To", "Tre"], "To") --> ["En", "Tre"]

******************************************************************************/

function cNotArr(arr, str) {
    if (arr.includes(str)) return arr.filter((element) => element !== str);
    else return arr.concat(str);
}

console.log("");
console.log("--EKSTRA UTFORDRING #1--");
console.log("");

console.log(cNotArr(["Rød", "Grønn"], "Blå"));
console.log(cNotArr(["Rød", "Grønn", "Blå"], "Grønn"));
console.log(cNotArr(["En", "To", "Tre"], "Fire"));
console.log(cNotArr(["En", "To", "Tre"], "To"));

/******************************************************************************
8.

EKSTRA UTFORDRING #2:

Dette er ikke obligatorisk, kun for de som vil ha en ekstra utfordring.

Lag følgende funksjon:

Funksjonen skal ta inn ett parameter.

Hvis parameteret er en string:
Returner stringen med "😎" lagt til i starten og slutten.

Hvis parameteret er et tall:
Doble verdien, konverter den til en string, og returner den med "😎" lagt til i
starten og slutten.

Hvis parameteret er en boolean:
Returner "😎Ja😎" hvis parameteret er true, eller "😎Slapp av😎" hvis parameteret er false.

Hvis parameteret er en annen datatype:
Returner "😎Kun primitive verdier😎".

******************************************************************************/

function checkVar(parameter) {
    if (typeof parameter === "string") {
        return `😎${parameter}😎`;
    } else if (typeof parameter === "number") {
        return `😎${parameter*2}😎`;
    } else if (typeof parameter === "boolean") {
        return parameter ? "😎Ja😎" : "😎Slapp av😎";
    } else {
        return "😎Kun primitive verdier😎"
    }
}

console.log("");
console.log("EKSTRA UTFORDRING #2");
console.log("");

console.log(checkVar("Dette er en tekststreng"));
console.log(checkVar(34));
console.log(checkVar(true));
console.log(checkVar(false));
console.log(checkVar({ id: 0, name: "na hÓglaigh" }));