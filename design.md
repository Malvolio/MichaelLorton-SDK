# LOTR Api for Node
Michael Lorton
July 19, 2022

## Deployment

This library is designed for deployment as a standard NPM package, but it has not been packaged yet.  As is, it can be git-clone and tested with `npm run test`.

# Principles

The API can be created by invoking the function `makeLOTRApi(config)`.  One API-object contains the connection to the back-end and the cache.

## Configuration

Currently, the configuration has a single entry `fetch`:

    export type LOTRApiConfig = { 
        fetch: (url: string) => Promise<any>;
    };

See the file `test/axiosFetch.ts` for an example of how to define `fetch` for [Axios](https://axios-http.com/).

## Entity Classes

The API consists of the following Entity Classes:

*  Book
*  Movie
*  Chapter
*  Character
*  Quote

Each Entity Class has two functions: `get` which can retrieve any instance of the underlying Entity by its ID, and `search` which will retrieve a list of Entities that match the argument.

For example:

    const books = await Book.search({ 
        name: ["rexp", "of"] 
    }); 

will retrieve every book whose name matches the regular expression `/of/`, to wit, _The Fellowship Of The Ring_ and _The Return Of The King_.  The fully type-checked search language is very rich, with the following comparators supported:

* eq
* ne
* lt
* gt
* lte
* gte
* rexp
* nrexp
* inc
* exc
* exist
* nexist

The `get` function synchronously returns a `Fetcher`, an object that can asynchronously retrieve the actual entity, like this:

    const book = await Book.get("5cf58080b53e011a64671584").fetch();

The entities that refer to other entities (_eg_ the Quote entity, which refers to the Character who spoke it and the Movie it is from), has a Fetcher object as a member.

## Testing

The tests can be run off the included sample data like this

    npm run test

or off the live data, if you have a token, like this

    AUTH_TOKEN=RAk9v4ZA1ab89m9IOAMD npm run test

## TODO 

* more extensive tests
* NPM packaging
* better caching
