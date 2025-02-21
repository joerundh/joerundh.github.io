/******************************************************************************
OPPGAVE 1

Din første oppgave er å koble denne JavaScript-filen til index.html-filen
ved å bruke en av metodene vi viste i første forelesning.

<-- Finn index.html-filen i filutforskeren og koble den til denne filen,
javascript.js
******************************************************************************/

// Oppgaven er løst i index.html, linje 16

/******************************************************************************
OPPGAVE 2

I forrige undervisning lærte vi hvordan man lager variabler som kan holde ulike
typer verdier. Lag noen variabler med følgende datatyper:
- String (tekst)
- Number (tall)
- Boolean (sann/usann)
- Array (liste)

Du kan velge hva innholdet i variablene skal være. Prøv å bruke både let og 
const når du definerer variablene.

******************************************************************************/

let str1 = "Dette er en tekststreng";
const str2 = "Dette er også en tekststreng, og den kan ikke endres på";

let num1 = 3.141592653;
const num2 = 2.718281828;

let areYouReadingThis = true;
const doesETypeGotLife = true;

let numArr = [ 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169 ];
const firstNames = [ "Tom", "Paddy", "Liam", "Tommy" ];

/******************************************************************************
OPPGAVE 3

Prøv ut noen av operatorene vi så på i forrige forelesning:
- Matematiske operatorer: +, -, /, *
- Forkortede operatorer: ++, --, +=, -=

Skriv noen eksempler der du tester disse operatorene.
******************************************************************************/

const a1 = 57;
const b1 = 33;
let c1 = a1 + b1;   // 90

const a2 = 49;
const b2 = 98;
let c2 = a2 - b2;   // -49

const a3 = 7;
const b3 = 8;
let c3 = a3*b3;     // 56

const a4 = 48;
const b4 = 12;
let c4 = a4/b4;     // 4

c1++;               // 91
c2--;               // -50
c3 += 7;            // 63
c4 -= 3;            // 1

/******************************************************************************
OPPGAVE 4

Skriv en IF/ELSE-betingelse som sjekker følgende:
1. At userName ikke er tom ("").
2. At userAge er 18 eller eldre.
3. At userIsBlocked er false.

(TIPS: Bruk && (logisk OG) for å sjekke alle tre betingelsene i én IF-setning.)

- Hvis alle disse betingelsene er oppfylt, skal du sette variabelen
userIsLoggedIn til true og goToPage til "/home". Deretter skriver du ut en 
velkomstmelding med console.log.

- Hvis noen av betingelsene IKKE er oppfylt, skal du skrive ut en feilmelding
med console.log.

Prøv å endre verdiene på variablene for å sikre at IF/ELSE-setningen din 
håndterer alle tilfeller korrekt.
*****************************************************************************/

let userName = "";
let userAge = 18;
let userIsLoggedIn = false;
let userIsBlocked = false;
let goToPage = "";

// Funksjon som sjekker om alt stemmer og enten logger inn eller ikke

function attemptLogin(name, age, isBlocked) {
    if (name !== "" && age >= 18 && !isBlocked) {
        console.log(`Welcome, ${userName}! You are now logged in!`);
    } else {
        console.log("Something went wrong, the user could not be logged in.")
    }
}

// Kjører funksjonen under ulike forhold

console.log("First attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userName = "myusername";
userAge = 17;
console.log("Second attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userAge = 18;
userIsBlocked = true;
console.log("Third attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userIsBlocked = false;
console.log("Fourth attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

// Funksjon som spesifiserer hva som er galt

function attempLoginWithFullReport(name, age, isBlocked) {
    if (name !== "") {
        if (age >= 18) {
            if (!isBlocked) {
                userIsLoggedIn = true;
                goToPage = "/home";
                console.log(`Welcome, ${userName}! You are now logged in!`);
            } else {
                console.log("Could not log in: the user is blocked.");
            }
        } else {
            console.log("Could not log in: the user is below the age of 18.");
        }
    } else {
        console.log("Could not log in: no username provided.");
    }
}

// Resetter variablene, og kjører funksjonen under ulike forhold

userName = "";
userAge = 18;
userIsLoggedIn = false;
userIsBlocked = false;
goToPage = "";

console.log("First attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userName = "myusername";
userAge = 17;
console.log("Second attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userAge = 18;
userIsBlocked = true;
console.log("Third attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

userIsBlocked = false;
console.log("Fourth attempt:");
attempLoginWithFullReport(userName, userAge, userIsBlocked);

/******************************************************************************
OPPGAVE 5

Lag en variabel kalt userTitle og sett innholdet til å være:
- "Mr." hvis userMale er true, eller
- "Mrs." hvis userMale er false.

Bruk en ternary conditional for dette:

const variabel = betingelse ? "hvis sann" : "hvis usann";

Prøv å endre userMale til både true og false og bruk console.log for å sjekke
at betingelsen din fungerer som den skal.
******************************************************************************/

let userMale = false;       // Changed "const" to "let"

let userTitle = userMale ? "Mr." : "Mrs.";
console.log(`The user's title is ${userTitle}`);

userMale = true;
console.log("userMale set to 'true'");

userTitle = userMale ? "Mr." : "Mrs.";
console.log(`The user's title is ${userTitle}`);