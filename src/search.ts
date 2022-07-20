import { find } from "lodash/fp";

const BinSearchValues = [
  "eq",
  "ne",
  "lt",
  "gt",
  "lte",
  "gte",
  "rexp",
  "nrexp",
] as const;
const ListSearchValues = ["inc", "exc"] as const;
const ExistSearchValues = ["exist", "nexist"] as const;
type BinSearchSpec = [typeof BinSearchValues[number], string];
type ListSearchSpec = [typeof ListSearchValues[number], string[]];
type ExistSearchSpec = [typeof ExistSearchValues[number]];
export type SearchSpec = BinSearchSpec | ListSearchSpec | ExistSearchSpec;

const isBinSearch = (s: SearchSpec): s is BinSearchSpec =>
  !!find((v) => v === s[0])(BinSearchValues);

const isListSearch = (s: SearchSpec): s is ListSearchSpec =>
  !!find((v) => v === s[0])(ListSearchValues);

const isExistSearch = (s: SearchSpec): s is ExistSearchSpec =>
  !!find((v) => v === s[0])(ExistSearchValues);

const BinTranslate = {
  eq: "=",
  ne: "!=",
  lt: "<",
  gt: ">",
  lte: "<=",
  gte: ">=",
  rexp: "=",
  nrexp: "!=",
};
const binSearchSpecAsParm = (name: string, [rule, v]: BinSearchSpec) => {
  const value = rule === "rexp" || rule === "nrexp" ? `/${v}/i` : v;
  return `${name}${BinTranslate[rule]}${value}`;
};
const listSearchSpecAsParm = (name: string, [rule, values]: ListSearchSpec) => {
  return `${name}${rule === "inc" ? "=" : "!="}${values.join(",")}`;
};
const existSearchSpecAsParm = (name: string, [rule]: ExistSearchSpec) => {
  return `${rule === "exist" ? "" : "!"}${name}`;
};

export const searchSpecAsParm = (name: string, s: SearchSpec): string =>
  isBinSearch(s)
    ? binSearchSpecAsParm(name, s)
    : isListSearch(s)
    ? listSearchSpecAsParm(name, s)
    : existSearchSpecAsParm(name, s);
