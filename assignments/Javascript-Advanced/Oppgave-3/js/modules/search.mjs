/*
This namespace has functions to retrieve objects from Open Library APIs for:

- Works:
    I.e. books, or rather titles, in an "abstract" sense; an object which
    (ideally) contains a key, a title, an author reference, a date or year
    of publication, and a key to a cover.

    Objects of this particular form only have keys to the authors. As such,
    when viewing a book profile, the name of the author(s) must be found
    by another call to the API, to get an object describing the author (see
    also below), and picking out the name only.

- Authors:
    Contains name, birth and death dates (sometimes), and a description/bio
    (although a brief one).

- Search:
    From the search form, one or more of the inputs Title, Author and Year is
    entered, the information is sent to the API, which then returns a search object
    containing objects describing books which match the entered data.

    As the API itself has a meagre set of sorting functions which seem relevant,
    no offset nor limit is used here. As a result, only 100 results are returned.
    These may, however, in turn be sorted in any way one would like. This is done in 
    the app script.

    It is also the case that search result objects contain two different keys to
    cover images, while Work objects (see above) contain one of these. As such, 
    the one that is in common for both situations is used. This should also 
    guarantee more or less that the same cover picture appears everywhere for
    the same book.
*/

export function BookSearcher() {
    const apiUrl = "https://openlibrary.org";
    const searchApiUrl = "https://openlibrary.org/search.json";
    const coversApiUrl = "https://covers.openlibrary.org/b/id";
    const authorPhotoApiUrl = "https://covers.openlibrary.org/a/olid";

    this.createBookPromise = function(key) {
        return fetch(
            `${apiUrl}/works/${key}.json`,
            {
                method: "GET"
            }
        );
    }

    this.createAuthorPromise = function(key) {
        return fetch(
            `${apiUrl}/authors/${key}.json`,
            {
                method: "GET"
            }
        );
    }

    this.createSearchPromise = function(title, author, year) { 
        const params = new URLSearchParams();

        if (title) {
            params.append("title", `${title}`);
        }
        if (author) {
            params.append("author", `${author}`);
        }
        if (year) {
            params.append("year", `${year}`)
        }

        return fetch(
            `${searchApiUrl}?${params.toString()}`,
            {
                method: "GET"
            }
        );
    }
}
