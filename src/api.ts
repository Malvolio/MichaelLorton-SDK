import { SearchSpec, searchSpecAsParm } from "./search";
import { EntityClass, Fetcher, LOTREntity, NamedLOTREntity } from "./types";
import { SearchOptions } from "./types";
import { toPairs } from "lodash/fp";

export type Book = NamedLOTREntity & { _type: "book" };
export type Character = NamedLOTREntity & {
  _type: "character";
  height?: string;
  race?: string;
  gender?: string;
  birth?: string;
  spouse?: string;
  death?: string;
  realm?: string;
  hair?: string;
  wikiUrl?: string;
};

export type Chapter = NamedLOTREntity & {
  _type: "chapter";
  book: Fetcher<Book>;
};
export type Movie = NamedLOTREntity & { _type: "movie" };
export type Quote = LOTREntity & {
  _type: "quote";
  dialog: string;
  movie: Fetcher<Movie>;
  character: Fetcher<Character>;
};

export type LOTRApiConfig = {
  fetch: (url: string) => Promise<any>;
};

const constructNamedEntity =
  <T extends NamedLOTREntity>(_type: T["_type"]) =>
  (a: any) => {
    const { _id, name } = a as { _id: string; name: string };
    return { _type, _id, name };
  };

const composeParms = <T extends LOTREntity>(s: SearchOptions<T>) => {
  const sp: [string, SearchSpec][] = toPairs(s);
  return sp.map((p) => searchSpecAsParm(...p)).join("&");
};

export const makeLOTRApi = (config: LOTRApiConfig) => {
  const makeEntityClass = <T extends LOTREntity>(
    type: string,
    constructor: (a: unknown) => T
  ): EntityClass<T> => {
    const cache: Record<string, T> = {};
    const get = (id: string): Fetcher<T> => ({
      async fetch(): Promise<T> {
        if (id in cache) {
          return cache[id];
        }
        const d = await config.fetch(`${type}/${id}`);
        const ent = constructor(d.docs[0]);
        cache[id] = ent;
        return ent;
      },
    });
    const search = async (options: SearchOptions<T>): Promise<T[]> => {
      const d = await config.fetch(`${type}?${composeParms(options)}`);
      const rv: T[] = d.docs.map(constructor);
      rv.forEach((ent) => {
        cache[ent._id] = ent;
      });
      return rv;
    };
    return {
      get,
      search,
    };
  };
  const Book = makeEntityClass<Book>(
    "book",
    constructNamedEntity<Book>("book")
  );
  const Movie = makeEntityClass<Movie>(
    "movie",
    constructNamedEntity<Movie>("movie")
  );
  const Character = makeEntityClass<Character>(
    "character",
    (a: any): Character => {
      return { ...a, _type: "character" };
    }
  );
  const Chapter = makeEntityClass<Chapter>("chapter", (a: any): Chapter => {
    const { _id, chapterName, book } = a as {
      _id: string;
      chapterName: string;
      book: string;
    };
    return { _type: "chapter", _id, name: chapterName, book: Book.get(book) };
  });
  const Quote = makeEntityClass<Quote>("quote", (a: any): Quote => {
    const { _id, dialog, movie, character } = a as {
      _id: string;
      dialog: string;
      movie: string;
      character: string;
    };
    return {
      _type: "quote",
      _id,
      dialog,
      movie: Movie.get(movie),
      character: Character.get(character),
    };
  });
  return { Book, Movie, Chapter, Character, Quote };
};
