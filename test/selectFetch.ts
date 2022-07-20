import { fetch as axiosFetch } from "./axiosFetch";
import { fetch as fileFetch } from "./fileFetch";

import process from "process";

export const fetch = process.env["AUTH_TOKEN"] ? axiosFetch : fileFetch;
