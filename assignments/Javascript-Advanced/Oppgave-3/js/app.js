/*
=================================================================================
----------------------------Book and Author Search-------------------------------
=================================================================================

This "app" communicates with the Open Library API to fetch information about books
and authors, based firstly on searches that the user may perform.

It then uses a module ObjectStorage to allow the user to "favourite" books and 
authors, and then look them up later. These "favourites" may be removed at 
any time.
*/


/*===============================================================================
Modules, objects and common functions
===============================================================================*/

import { Navigator } from "./modules/navigator.mjs";
import { BookSearcher } from "./modules/search.mjs";
import { ObjectStorage } from "./modules/objectstorage.mjs";
import { toCapitalized } from "./modules/strings.mjs";

/*
Objects used to store favourited books/authors in the local storage
*/

const favBooks = new ObjectStorage("Book search - Favourite books", [ "key", "title", "first_publish_year", "author_key", "author_name", "cover_key" ]);
const favAuthors = new ObjectStorage("Book search - Favourite authors", [ "key", "name", "feature_key" ]);

/*
Object which is used to create promises for API fetches. These are then handled in
functions below, in which the information in the objects (assuming it's there) is
placed appropriately onto the page.
*/

const searcher = new BookSearcher();

function generateMessage(text) {
    /*
    Generates a p element, inserts the provided string into its text content, 
    and returns the p element
    */
    const message = document.createElement("p");
    message.textContent = `${text}`;
    return message;
}

function generateLoadingIcon() {
    /*
    Generates a loading icon, which rotates, and which may be inserted wherever
    one pleases
    */
    const loadingIcon = document.createElement("img");
    loadingIcon.src = "../css/images/loading-icon.svg";
    loadingIcon.className = "loading-icon";
    return loadingIcon;
}

/*===============================================================================
Navigation and navbar
===============================================================================*/

/*
Object used for navigating between section
*/

const navigator = new Navigator();

const gotoSearch = document.getElementById("goto-search");
const gotoUserProfile = document.getElementById("goto-user-profile");

const main = document.getElementsByTagName("main")[0];

gotoSearch.addEventListener("click", event => {
    /*
    Opens the search section
    */
    if (results.objects) {
        listSelection();
    }
    navigator.goToSection(1);
    clearUserProfile();
    clearBookProfile();
    clearAuthorProfile();
})

gotoUserProfile.addEventListener("click", event => {
    /*
    Opens the "Favourites" section, previously called "User profile"
    */
    navigator.goToSection(0);
    openUserProfile();
    clearBookProfile();
    clearAuthorProfile();
})

/*===============================================================================
User favourites
===============================================================================*/

const favouriteBooksList = document.getElementById("favourite-books-list");
const favouriteAuthorsList = document.getElementById("favourite-authors-list");

const clearFavouriteBooks = document.getElementById("clear-favourite-books");
const clearFavouriteAuthors = document.getElementById("clear-favourite-authors");

function createHorizontalBookListItem(book) {
    /*
    Creates an element which may be inserted into a div of class ".horizontal", 
    in which the elements are placed horizontally, and which one browses through
    by scrolling horizontally as well.
    */
    const element = document.createElement("div");
    element.className = "horizontal-item";

    /*
    Cover
    */
    const cover = document.createElement("div");
    cover.className = "cover";
    element.append(cover);
    cover.append(generateLoadingIcon());

    /*
    Fetch the cover image
    */
    const img = new Image();
    if (book["cover_key"]) {
        new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej();
            img.src = `https://covers.openlibrary.org/b/id/${book["cover_key"]}-M.jpg`;
        })
            .then(() => {
                cover.innerHTML = "";
                cover.style.backgroundImage = `url("${img.src}")`;
            });
    } else {
        /*
        Default cover picture
        */
        img.src = "../css/images/profile-icon.svg";
        cover.innerHTML = "";
        cover.style.backgroundImage = `url("../css/images/book-line-icon.svg")`;
    }
    cover.onclick = () => {
        /*
        Open the book profile if the cover image is clicked
        */
        loadBookProfile(book["key"]);
        navigator.goToSection(2);
        clearUserProfile();
    }

    /*
    Title
    */
    const title = document.createElement("button");
    title.className = "book-title";
    title.textContent = `${book["title"]}`;
    title.title = "Open book profile";
    title.onclick = () => {
        /*
        Open the book profile if the title is clicked
        */
        loadBookProfile(book["key"]);
        navigator.goToSection(2);
        clearUserProfile();
    }
    element.append(title);

    /*
    Remove button: deletes the favourite from the list
    and reloads the "Favourites page"
    */
    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => {
        favBooks.deleteObject(book.objectStorageKey);
        openUserProfile();
    }

    element.append(remove);

    return element;
}

function createHorizontalAuthorListItem(author) {
    /*
    Similar to the function just above, but for authors instead of books
    */
    const element = document.createElement("div");
    element.className = "horizontal-item";

    /*
    Feature
    */
    const feature = document.createElement("div");
    feature.className = "feature";
    element.append(feature);
    feature.append(generateLoadingIcon());

    const img = new Image();
    if (author["feature_key"]) {
        new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej();
            img.src = `https://covers.openlibrary.org/a/id/${author["feature_key"]}-M.jpg`;
        })
            .then(() => {
                feature.innerHTML = "";
                feature.style.backgroundImage = `url("${img.src}")`;
            });
    } else {
        img.src = "../css/images/profile-icon.svg";
        feature.innerHTML = "";
        feature.style.backgroundImage = `url("../css/images/profile-icon.svg")`;
    }
    feature.onclick = () => {
        loadAuthorProfile(author["key"]);
        navigator.goToSection(3);
        clearUserProfile();
    }

    const name = document.createElement("button");
    name.className = "author-name";
    name.textContent = `${author["name"]}`;
    name.title = "Open author profile";
    name.onclick = () => {
        loadAuthorProfile(author["key"]);
        navigator.goToSection(3);
        clearUserProfile();
    }
    element.append(name);

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.onclick = () => {
        favAuthors.deleteObject(author.objectStorageKey);
        openUserProfile();
    }

    element.append(remove);

    return element;
}

function openUserProfile() {
    /*
    When the "Favourites" section should be viewed, all book and author objects
    are fetched from the object storages (local storage), and horizontal list items
    are created for each one and inserted into the relevant list.
    */
    favouriteBooksList.innerHTML = "";
    favouriteAuthorsList.innerHTML = "";

    /*
    Favourite books
    */
    if (favBooks.length()) {
        favBooks.getAllObjects().forEach(book => {
            favouriteBooksList.append(createHorizontalBookListItem(book));
        });
    } else {
        favouriteBooksList.append(generateMessage("No favourite books."));
    }

    /*
    Favourite authors
    */
    if (favAuthors.length()) {
        favAuthors.getAllObjects().forEach(author => {
            const item = createHorizontalAuthorListItem(author);
            favouriteAuthorsList.append(item);
        });
    } else {
        favouriteAuthorsList.append(generateMessage("No favourite authors"));
    }
}

function clearUserProfile() {
    favouriteBooksList.innerHTML = "";
    favouriteAuthorsList.innerHTML = "";
}

clearFavouriteBooks.onclick = () => {
    favBooks.deleteAllObjects();
    openUserProfile();
}

clearFavouriteAuthors.onclick = () => {
    favAuthors.deleteAllObjects();
    openUserProfile();
}

/*===============================================================================
Search
===============================================================================*/

const searchForm = document.getElementById("search-form");
const searchMessage = document.getElementById("search-message");
const searchResults = document.getElementById("search-results");

const titleInput = document.getElementById("search-title-input");
const authorInput = document.getElementById("search-author-input");
const yearInput = document.getElementById("search-year-input");
const searchReset = document.getElementById("search-reset");

const resultsSorting = document.getElementById("search-results-sorting-select");

const resultsPerPage = document.getElementById("search-results-per-page-input")

const resultsViewing = document.getElementById("search-results-viewing");
const resultsTotal = document.getElementById("search-results-total");

const resultsList = document.getElementById("search-results-list");

const resultsCurrentPage = document.getElementById("search-results-current-page");
const resultsPageCount = document.getElementById("search-results-page-count");

const resultsFirstPage = document.getElementById("search-results-first-page");
const resultsPrevPage = document.getElementById("search-results-prev-page");
const resultsNextPage = document.getElementById("search-results-next-page");
const resultsLastPage = document.getElementById("search-results-last-page");

/*
Results objects and settings:

an object is created which holds how many of the search results should be viewed per 
page, which page is being viewed, which sorting method should be used, how many
pages there are in total, and 
*/

const results = {
    offset: 0,
    limit: 10,
    currentPage: 0,
    pageCount: 0,
    sorting: 0
};

/*
Sorting functions:

Functions to sort the search results in different manners
*/

const sortFn = [
    (obj1, obj2) => obj1["search_index"] - obj2["search_index"],
    (obj1, obj2) => obj1["title"].localeCompare(obj2["title"]),
    (obj1, obj2) => obj2["title"].localeCompare(obj1["title"]),
    (obj1, obj2) => obj1["author_name"][0].split(" ").at(-1).localeCompare(obj2["author_name"][0].split(" ").at(-1)),
    (obj1, obj2) => obj2["author_name"][0].split(" ").at(-1).localeCompare(obj1["author_name"][0].split(" ").at(-1)),
    (obj1, obj2) => obj1["first_publish_year"] - obj2["first_publish_year"],
    (obj1, obj2) => obj2["first_publish_year"] - obj1["first_publish_year"]
];

/*
Message functions: shows a loading icon and "Searching..." while the reply
from the API is being awaited
*/

function openSearchMessage(text) {
    searchMessage.innerHTML = "";

    const message = generateMessage(text);
    searchMessage.append(message);
}

function openSearchLoadingMessage(text) {
    searchMessage.innerHTML = "";

    searchMessage.append(generateLoadingIcon(), generateMessage(text));
    searchMessage.style.display = "flex";
}

function closeSearchMessage() {
    searchMessage.innerHTML = "";
    searchMessage.style.display = "none";
}

function createResultsListItem(book) {
    /*
    Creates a list item element for the search result list, and returns it.
    */

    const element = document.createElement("li");
    element.className = "search-results-list-item";

    /*
    Cover photo:

    This must be fetched separately from the API. If it is not found, 
    a placeholder image is used instead.
    */

    const cover = document.createElement("div");
    cover.className = "cover";
    cover.append(generateLoadingIcon());

    const img = document.createElement("img");
    if (book["cover_edition_key"]) {
        new Promise((res, rej) => {
            img.onload = () => res();
            img.onerror = () => rej();
            img.src = `https://covers.openlibrary.org/b/olid/${book["cover_edition_key"]}-M.jpg`;
        })
            .then(() => {
                img.title = "Cover photo";
                img.alt = "Cover photo";
                cover.innerHTML = "";
                cover.append(img);
            })
            .catch(() => {
                img.onload = null;
                img.onerror = null;
                img.src = "../css/images/book-line-icon.svg";
                img.className = "missing-cover";
                img.title = "Missing cover photo";
                img.alt = "Missing cover photo"
                cover.innerHTML = "";
                cover.append(img);
            });
    } else {
        img.src = "../css/images/book-line-icon.svg";
        img.className = "missing-cover";
        img.title = "Missing cover photo";
        img.alt = "Missing cover photo";
        cover.innerHTML = "";
        cover.append(img);
    }

    /*
    Info:

    Title, year and authors. The title can be clicked to open the book profile
    and (hopefully) see more information about it, while the author names may
    be clicked to see more information about them (that is, if the API has it).
    */

    const info = document.createElement("div");
    info.className = "info";

    const title = document.createElement("a");
    title.className = "title";
    title.title = "View book info";
    title.textContent = toCapitalized(book["title"]);
    title.onclick = () => {
        loadBookProfile(book.key);
        navigator.goToSection(2);
    };

    const year = document.createElement("p");
    year.className = "year";
    year.textContent = book["first_publish_year"];
    
    const authors = document.createElement("p");
    authors.className = "authors";
    if (book["author_name"]) {
        book["author_name"].forEach((author, i) => {
            const authorButton = document.createElement("button");
            authorButton.textContent = `${author}`;
            authorButton.title = `View author`;

            authorButton.onclick = () => {
                loadAuthorProfile(book["author_key"][i]);
                navigator.goToSection(3);
            };

            authors.append(authorButton);
        });
    }

    info.append(title, year, authors);

    /*
    Options:

    One may favourite a book right away in the search results by clicking the star icon,
    one may open the book's profile on the Open Library website, or one may press the "i" button
    to open the book profile in that way (same as clicking the title)
    */

    const options = document.createElement("div");
    options.className = "options";

    const moreInfo = document.createElement("button");
    const infoIcon = document.createElement("img");
    infoIcon.src = "../css/images/info-icon.svg";
    moreInfo.append(infoIcon);

    /*
    The favourite button of the search result item is set to outline or filled gold depending on
    whether or not the book has been favourited already. When clicking it, it is either 
    favourited or de-favourited, and the icon changes accordingly as well.
    */
    const favourite = document.createElement("button");
    const favIcon = document.createElement("img");
    if (favBooks.searchForValue("key", book["key"]).length) {
        favIcon.src = "../css/images/one-star-icon.svg"
        favIcon.style.filter = "none";
        favourite.title = "Remove from favourites";
    } else {
        favIcon.src = "../css/images/one-star-outline-icon.svg";
        favIcon.style.filter = "contrast(0%)";
        favourite.title = "Add to favourites";
    }
    favourite.onclick = event => {
        const favSearch = favBooks.searchForValue("key", book["key"]);
        if (favSearch.at(0)) {
            favBooks.deleteObject(favSearch[0].objectStorageKey);
            favIcon.src = "../css/images/one-star-outline-icon.svg";
            favIcon.style.filter = "contrast(0%)";
            favourite.title = "Add to favourites";
        } else {
            favBooks.addObject([
                book["key"],
                book["title"],
                book["first_publish_date"],
                book["author_key"],
                book["author_name"],
                book["cover_i"]
            ]);
            favIcon.src = "../css/images/one-star-icon.svg";
            favIcon.style.filter = "none";
            favourite.title = "Remove from favourites";
        }
    }
    favourite.append(favIcon);
    

    const open = document.createElement("button");
    const openIcon = document.createElement("img");
    openIcon.src = "../css/images/export-share-icon.svg";
    open.append(openIcon);
    open.title = "View in Open Library";
    open.onclick = event => {
        window.open(`https://openlibrary.org/works/${book["key"]}`, "_blank")
    }

    options.append(moreInfo, favourite, open);

    /*
    Append and return
    */

    element.append(cover, info, options);

    return element;
}

function loadSearchResults() {
    /*
    When running a book search, first the results list is emptied (should there be results 
    there already), and a loading message is opened.

    Then, a Promise is fetched from the BookSearcher object, which then eventually returns
    an array of objects representing all the book search results (i.e. books). With small
    re-writings of the properties of the objects (which, believe you me, has been
    pain-stakingly found to be useful), they are next passed to the function 
    viewSearchResults(), which performs the arithmetics of dividing the results into such-and-such
    a number of pages containing such-and-such a number of results.
    */
    searchResults.style.display = "none";
    clearSearchResults();
    openSearchLoadingMessage("Searching...");

    searcher.createSearchPromise(
        titleInput.value,
        authorInput.value,
        yearInput.value
    )
    .then(results => results.json())
    .then(data => {
        const books = data["docs"];
        books.forEach((obj, i) => {
            obj["key"] = obj["key"].split("/").at(-1);              // Take only the relevant part of the key of each object
            obj["search_index"] = i;                                // Add an index to allow for sorting according to relevance
        });

        if (books.length) {
            results.objects = books;
            results.length = books.length;
            resultsTotal.textContent = results.length;
            viewSearchResults(books);
        } else {
            openSearchMessage("No results found.");
        }
    });
}

function viewSearchResults() {
    /*
    Aside from when loadSearchResults() is called, this functions is called directly
    only when the results sorting method is changed, or when the number of results
    per page is changed. The latter of these resets the results page to the first and
    possibly changes the number of pages. The first leaves the number of pages unchanged,
    but changes the order of the result objects, and thus also resets the page to the 
    first one.
    */

    /*
    Sort the results
    */

    results.objects.sort(sortFn[results.sorting]);            // Sort according to the currently chosen method

    /*
    Set the value of the per page input
    */
    resultsPerPage.value = results.limit;

    /*
    Fill the page selection box with page numbers, set the total page count display value,
    and set the current page to the first one
    */

    results.pageCount = Math.ceil(results.length/results.limit);
    resultsPageCount.textContent = results.pageCount;

    results.currentPage = 0;
    resultsCurrentPage.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
        const pageOption = document.createElement("option");
        pageOption.value = i;
        pageOption.textContent = `${i  + 1}`;
        pageOption.title = `Go to page ${i + 1}`;
        resultsCurrentPage.append(pageOption);
    }
    resultsCurrentPage.value = results.currentPage;

    /*
    Remove the loading message and list the results
    */

    closeSearchMessage();
    listSelection();
    searchResults.style.display = "flex";
}

function listSelection(books) {
    /*
    This function is called directly only when the value of the page selection box 
    is changed, or one of the page change buttons ("First", "Prev", "Next", "Last")
    are clicked. 
    */

    /*
    Fill the results list
    */
    resultsList.innerHTML = "";

    const selection = results.objects.slice(results.currentPage*results.limit, (results.currentPage + 1)*results.limit);
    for (let book of selection) {
        const item = createResultsListItem(book);
        resultsList.append(item);
    }

    /*
    Set the header with which results out how the total are being viewed
    */
    resultsViewing.textContent = `${
        results.currentPage*results.limit + 1
    } - ${
        results.currentPage === results.pageCount - 1 ? results.length : (results.currentPage + 1)*results.limit
    }`;
}

function clearSearchForm() {
    searchResults.style.display = "none";
    clearSearchResults();
    titleInput.value = "";
    yearInput.value = "";
    authorInput.value = "";
}

function clearSearchResults() {
    /*
    Removes the objects and  from the resuls
    */
    delete results.objects;
    delete results.length;

    searchMessage.innerHTML = "";
    resultsList.innerHTML = "";
    resultsViewing.textContent = "";
    resultsPageCount.textContent = "";
    resultsPerPage.value = "";
    resultsCurrentPage.innerHTML = "";
    resultsPageCount.textContent = "";
}

searchForm.onsubmit = event => {
    event.preventDefault();
    
    loadSearchResults();
};

searchReset.onclick = event => {
    event.preventDefault();
    clearSearchForm();
}

resultsSorting.onchange = () => {
    results.sorting = resultsSorting.value;
    viewSearchResults();
    main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

resultsFirstPage.onclick = () => {
    if (results.currentPage > 0) {
        results.currentPage = 0;
        resultsCurrentPage.value = results.currentPage;
        listSelection();
        main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
};

resultsPrevPage.onclick = () => {
    if (results.currentPage > 0) {
        results.currentPage--;
        resultsCurrentPage.value = results.currentPage;
        listSelection();
        main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
};

resultsNextPage.onclick = () => {
    if (results.currentPage < results.pageCount - 1) {
        results.currentPage++;
        resultsCurrentPage.value = results.currentPage;
        listSelection();
        main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
};
resultsLastPage.onclick = () => {
    if (results.currentPage < results.pageCount - 1) {
        results.currentPage = results.pageCount - 1;
        resultsCurrentPage.value = results.currentPage;
        listSelection();
        main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
};

resultsCurrentPage.onchange = () => {
    results.currentPage = resultsCurrentPage.value;
    listSelection();
    main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

resultsPerPage.onkeydown = event => {
    if (event.key === "Enter") {
        resultsPerPage.blur();
    } else if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
    }
};

resultsPerPage.onblur = () => {
    if (resultsPerPage.value === "") {
        resultsPerPage.value = 10;                          // Default value
    } else if (resultsPerPage.value < 1) {
        resultsPerPage.value = 1;                           // Show at least one result per page
    } else if (resultsPerPage.value > results.length) {
        resultsPerPage.value = results.length;              // Show maximum all results in one page
    }
    results.limit = resultsPerPage.value;
    viewSearchResults(results);
    main.scrollTo({ top: 0, left: 0, behavior: "smooth" });
};

/*===============================================================================
Book profile
===============================================================================*/

const bookProfileMessage = document.getElementById("book-profile-message");
const bookProfile = document.getElementById("book-profile");

const bookProfileTitle = document.getElementById("book-profile-title");
const bookProfileYear = document.getElementById("book-profile-year");
const bookProfileAuthors = document.getElementById("book-profile-authors");
const bookProfileDescription = document.getElementById("book-profile-description");
const bookProfileCoverLoading = document.getElementById("book-profile-cover-loading");
const bookProfileCover = document.getElementById("book-profile-cover");
const bookProfileFavourite = document.getElementById("book-profile-favourite");
const bookProfileFavouriteIcon = document.getElementById("book-profile-favourite-icon");
const bookProfileFavouriteLabel = document.getElementById("book-profile-favourite-label");
const bookProfileViewExternal = document.getElementById("book-profile-view-external");

function openBookProfileLoadingMessage() {
    bookProfileMessage.innerHTML = "";

    const loadingIcon = generateLoadingIcon();
    const loadingMessage = generateMessage("Loading book information");
    bookProfileMessage.append(loadingIcon, loadingMessage);
    bookProfileMessage.style.display = "flex";
}

function clearBookProfileMessage() {
    bookProfileMessage.innerHTML = "";
    bookProfileMessage.style.display = "none";
}

function loadBookProfile(key) {
    /*
    Similar to loadSearchProfile(), in that it fetches a Promise from the 
    BookSearcher object, edits the objects into a fitting number of properties
    (and selects the appropriate ones), and then passes it on to openBookProfile(), 
    which displays all the information on the page.
    */
    bookProfile.style.display = "none";
    openBookProfileLoadingMessage();

    searcher.createBookPromise(key)
        .then(results => results.json())
        .then(obj => {
            return {
                key: obj["key"].split("/").at(-1),
                title: obj["title"],
                first_publish_year: obj["first_publish_year"],
                author_key: obj["authors"].map(entry => entry["author"]["key"].split("/").at(-1)),
                description: typeof obj["description"] === "object" ? obj["description"]["value"] : obj["description"],
                cover_key: obj["covers"] ? obj["covers"][0] : undefined
            };
        })
        .then(obj => {
            obj["author_name"] = [];
            obj["author_key"].forEach((key, i) => {
                fetch(`https://openlibrary.org/authors/${key}.json`)
                    .then(response => response.json())
                    .then(author => {
                        obj["author_name"][i] = author["name"];
                    });
            });
            return obj;
        })
        .then(book => {
            openBookProfile(book);
        });
}

function openBookProfile(book) {
    /*
    This function takes a book object, fetches the information, and places it on the page
    */
    clearBookProfileMessage();      // Remove the "Loading" message

    /*
    Cover photo must, as always, be fetched separately. If it is not retrieved, 
    a default image is used instead
    */
    bookProfileCoverLoading.append(generateLoadingIcon(), generateMessage("Loading cover photo"));
    const cover = document.createElement("img");

    if (book["cover_key"]) {
        new Promise(res => {
            cover.onload = () => res();
            cover.src = `https://covers.openlibrary.org/b/id/${book["cover_key"]}-M.jpg`;
        })
        .then(() => {
            bookProfileCoverLoading.innerHTML = "";
            bookProfileCoverLoading.style.display = "none";
            bookProfileCover.append(cover);
        });
    } else {
        cover.src = "../css/images/book-line-icon.svg";
        cover.className = "missing-cover";
        bookProfileCoverLoading.innerHTML = "";
        bookProfileCoverLoading.style.display = "none";
        bookProfileCover.append(cover);
    }

    bookProfileTitle.textContent = `${book["title"]}`;

    if (book["first_publish_year"]) {                       // Believe it or not, this property is not always present
        const year = document.createElement("span");
        year.textContent = `${book["first_publish_year"]}`;
        bookProfileYear.append(year);
    }

    /*
    If the potential lack of publishing year was not unbelievable enough,
    book objects fetched in this manner generally DO NOT CONTAIN THE NAMES OF THE AUTHORS, 
    only API references to them, which may then be used in a NEW API CALL (pain in the ass)
    to retrieve an author object only to pick out the name (ugh).

    To save future time, the retrieved name is added to the author object, which then includes
    it when or if the author object is put into Object Storage.

    I mean, honestly, sure, this API is simple to use, and it's free, but goddamn, how lazily
    it's been put together. Lackluster, I believe, is the word for it. I mean, who leaves
    Wikipedia references in the author bio? Just cut those out! I can't do that, so now 
    they appear here too! Jesus wept.
    */

    bookProfileAuthors.append(generateLoadingIcon(), generateMessage("Loading authors..."));

    Promise.all(
        book["author_key"].map(async key => {
            return await fetch(`https://openlibrary.org/authors/${key}.json`)
                            .then(response => response.json())
                            .then(obj => { return { key: key, name: obj["name"] } });
        })
    )
    .then(authors => {
        bookProfileAuthors.innerHTML = "";
        authors.forEach(author => {
            const element = document.createElement("button");
            element.textContent = author.name;
            element.onclick = () => {
                loadAuthorProfile(author.key);
                navigator.goToSection(3);
                clearBookProfile();
            }
            bookProfileAuthors.append(element);
        });
    });
    
    bookProfileDescription.textContent = `${book["description"]}`;

    /*
    Fvourite button, works the same way as for the search results items
    */
    if (favBooks.searchForValue("key", book["key"]).length) {
        bookProfileFavourite.title = "Remove from favourites";
        bookProfileFavouriteIcon.src = "../css/images/one-star-icon.svg";
        bookProfileFavouriteIcon.style.filter = "none";
        bookProfileFavouriteLabel.textContent = "Remove from favourites";
    } else {
        bookProfileFavourite.title = "Add to favourites";
        bookProfileFavouriteIcon.src = "../css/images/one-star-outline-icon.svg";
        bookProfileFavouriteIcon.style.filter = "contrast(0%)";
        bookProfileFavouriteLabel.textContent = "Add to favourites";
    }
    bookProfileFavourite.onclick = event => {
        const favSearch = favBooks.searchForValue("key", book["key"]);
        if (favSearch.length) {
            favBooks.deleteObject(favSearch[0].objectStorageKey);
            bookProfileFavouriteIcon.src = "../css/images/one-star-outline-icon.svg";
            bookProfileFavouriteIcon.style.filter = "contrast(0%)";
            bookProfileFavouriteLabel.textContent = "Add to favourites";
            bookProfileFavourite.title = "Add to favourites";
        } else {
            favBooks.addObject([ book["key"], book["title"], book["first_publish_year"], book["author_key"], book["author_name"], book["cover_key"] ]);
            bookProfileFavouriteIcon.src = "../css/images/one-star-icon.svg";
            bookProfileFavouriteIcon.style.filter = "none";
            bookProfileFavouriteLabel.textContent = "Remove from favourites";
            bookProfileFavourite.title = "Remove from favourites";
        }
    }

    bookProfileViewExternal.onclick = event => {
        /*
        Open the book profile on the website
        */
        window.open(`https://openlibrary.org/works/${book["key"]}`, "_blank");
    }

    bookProfile.style.display = "flex";
}

function clearBookProfile() {
    bookProfileCover.innerHTML = "";
    bookProfileTitle.textContent = "";
    bookProfileYear.innerHTML = "";
    bookProfileAuthors.innerHTML = "";
    bookProfileDescription.textContent = "";
    bookProfileFavourite.onclick = null;
    bookProfileViewExternal.onclick = null;
}

/*===============================================================================
Author profile
===============================================================================*/

const authorProfileMessage = document.getElementById("author-profile-message");
const authorProfile = document.getElementById("author-profile");

const authorProfileFeatureLoading = document.getElementById("author-profile-feature-loading");
const authorProfileFeature = document.getElementById("author-profile-feature");
const authorProfileName = document.getElementById("author-profile-name");
const authorProfileYears = document.getElementById("author-profile-years");
const authorProfileBio = document.getElementById("author-profile-bio-content");
const authorProfileFavourite = document.getElementById("author-profile-favourite");
const authorProfileFavouriteIcon = document.getElementById("author-profile-favourite-icon");
const authorProfileFavouriteLabel = document.getElementById("author-profile-favourite-label");
const authorProfileSearch = document.getElementById("author-profile-search");
const authorProfileViewExternal = document.getElementById("author-profile-view-external");

function openAuthorProfileLoadingMessage() {
    authorProfileMessage.innerHTML = "";

    const loadingIcon = generateLoadingIcon();
    const loadingMessage = generateMessage("Loading author information...");
    authorProfileMessage.append(loadingIcon, loadingMessage);
    authorProfileMessage.style.display = "flex";
}

function clearAuthorProfileMessage() {
    authorProfileMessage.innerHTML = "";
    authorProfileMessage.style.display = "none";
}

function loadAuthorProfile(key) {
    /*
    Very similar as for loadBookProfile
    */
    authorProfile.style.display = "none";
    openAuthorProfileLoadingMessage();

    searcher.createAuthorPromise(key)
        .then(results => results.json())
        .then(obj => {
            const author = {
                key: obj["key"].split("/").at(-1),
                name: obj["name"],
                birth_date: obj["birth_date"],
                death_date: obj["death_date"],
                bio: typeof obj["bio"] === "object" ? obj["bio"]["value"] : obj["bio"],
                feature_key: obj["photos"] ? obj["photos"][0] : undefined
            };
            openAuthorProfile(author);
        });
}

function openAuthorProfile(author) {
    /*
    Takes an author object from the API, generates elements to contain and display 
    the information, and places them in the appropriate DOM element
    */
    clearAuthorProfileMessage();

    /*
    Feature photo: 

    As images are not JSON-able, they are fetched independently.
    */

    authorProfileFeatureLoading.append(generateLoadingIcon(), generateMessage("Loading feature..."))
    const feature = document.createElement("img");
    if (author["feature_key"]) {
        new Promise((res, rej) => {
            feature.onload = () => res();
            feature.onerror = error => rej(error);
            feature.src = `https://covers.openlibrary.org/a/id/${author["feature_key"]}-M.jpg`;
        })
            .then(() => {
                authorProfileFeatureLoading.innerHTML = "";
                authorProfileFeatureLoading.style.display = "none";
                authorProfileFeature.append(feature);
            })
            .catch(() => {
                feature.onload = null;
                feature.onerror = null;
                feature.src = "../css/images/profile-icon.svg";
                feature.className = "missing-feature";
                authorProfileFeatureLoading.innerHTML = "";
                authorProfileFeatureLoading.style.display = "none";
                authorProfileFeature.append(feature);
            });
    } else {
        feature.src = "../css/images/profile-icon.svg";
        feature.className = "missing-feature";
        authorProfileFeatureLoading.innerHTML = "";
        authorProfileFeatureLoading.style.display = "none";
        authorProfileFeature.append(feature);
    }

    authorProfileName.textContent = `${author["name"]}`;

    if (!author["birth_date"] && !author["death_date"]) {
        authorProfileYears.textContent = "No dates available";
    } else {
        authorProfileYears.textContent = `${author["birth_date"] || "?"} - `;
        authorProfileYears.textContent += `${author["death_date"] || ""}`;
    }
    
    if (author["bio"]) {
        authorProfileBio.textContent = `${author["bio"]}`;
    } else {
        authorProfileBio.textContent = "No information available.";
    }

    /*
    Yet another favourite button, but for authors this time
    */
    if (favAuthors.searchForValue("key", author["key"]).length) {
        authorProfileFavouriteIcon.src = "../css/images/one-star-icon.svg";
        authorProfileFavouriteIcon.style.filter = "none";
        authorProfileFavouriteLabel.textContent = "Remove from favourites";
        authorProfileFavourite.title = "Remove from favourites";
    } else {
        authorProfileFavouriteIcon.src = "../css/images/one-star-outline-icon.svg";
        authorProfileFavouriteIcon.style.filter = "contrast(0%)";
        authorProfileFavouriteLabel.textContent = "Add to favourites";
        authorProfileFavourite.title = "Add to favourites";
    }
    authorProfileFavourite.onclick = event => {
        const favSearch = favAuthors.searchForValue("key", author["key"]);
        if (favSearch.length) {
            favAuthors.deleteObject(favSearch[0].objectStorageKey);
            authorProfileFavouriteIcon.src = "../css/images/one-star-outline-icon.svg";
            authorProfileFavouriteIcon.style.filter = "contrast(0%)";
            authorProfileFavouriteLabel.textContent = "Add to favourites";
            authorProfileFavourite.title = "Add to favourites";
        } else {
            favAuthors.addObject([ author["key"], author["name"], author["feature_key"]]);
            authorProfileFavouriteIcon.src = "../css/images/one-star-icon.svg";
            authorProfileFavouriteIcon.style.filter = "none";
            authorProfileFavouriteLabel.textContent = "Remove from favourites";
            authorProfileFavourite.title = "Remove from favourites";
        }
    };

    authorProfileViewExternal.onclick = event => {
        window.open(`https://openlibrary.org/authors/${author["key"]}`, "_blank");
    }

    authorProfileSearch.onclick = () => {
        clearSearchForm();
        authorInput.value = author["name"];
        loadSearchResults();
        navigator.goToSection(1);
        clearAuthorProfile();
    }

    authorProfile.style.display = "flex";
}

function clearAuthorProfile() {
    /*
    Removes all elements created by openAuthorProfile()
    */
    authorProfileFeature.innerHTML = "";
    authorProfileName.textContent = "";
    authorProfileYears.innerHTML = "";
    authorProfileBio.textContent = "";
    authorProfileFavourite.onclick = null;
    authorProfileViewExternal.onclick = null;
}

/*===============================================================================
Startup
===============================================================================*/

navigator.goToSection(0);
openUserProfile();

/*
If the comments are lackluster (there's that word again), just note that this script
alone, say without comments, is slightly less than 1000 lines. Now, that number
is increased by more than 150.

I swear, eventhough this script took a long time to write, it could probably have 
been shortened somewhat. But that's what happens when completing a work in progress.
*/