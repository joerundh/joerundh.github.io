export function toCapitalized(str) {
    /*
    Takes a string and returns it with each word to be
    found in it capitalized.
    */
    return str;
}

export function toDashedLowerCase(str) {
    /*
    Takes a string and sets it to lowercase, 
    removes all non-alphanumerical characters,
    except dashes and replaces all the spaces 
    and underscores with a single dash
    */
    return `${str}`
            .toLowerCase()
            .split(/[^0-9a-z]+/)
            .filter(x => x.length)
            .join("-");
}

export function toCamelCase(str) {
    return `${str}`
            .toLowerCase()
            .split(/[^0-9a-z]+/)
            .filter(x => x.length)
            .flatMap(x => x.split(/(?<=\D)(?=\d)|(?<=\d)(?=\D)/))
            .map((x, i) => i === 0 ? x : x.charAt(0).toUpperCase() + x.substring(1))
            .join("")
}

export function randomAlphanumerical(n) {
    /*
    Takes an integral value n, and returns a string of length n
    consisting of alphanumerical 
    */
    const str = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return new Array(n)
                .fill(0)
                .map(() => str.charAt(Math.floor(str.length*Math.random())))
                .join("");
}