import { SearchSpec } from "./search";

export type LOTREntity = {
  _id: string;
  _type: string;
};

export type NamedLOTREntity = LOTREntity & {
  name: string;
};

export type Fetcher<T extends LOTREntity> = {
  fetch(): Promise<T>;
};

export type EntityClass<T extends LOTREntity> = {
  get(id: string): Fetcher<T>;
  search(options: SearchOptions<T>): Promise<T[]>;
};

export type SearchOptions<T extends LOTREntity> = {
  [key in Exclude<keyof T, "_id" | "_type">]?: SearchSpec;
};
