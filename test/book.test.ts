import { fetch } from "./selectFetch";
import { makeLOTRApi } from "../src/api";

test("retrieves book", async () => {
  const { Book } = makeLOTRApi({ fetch });
  const b = await Book.get("5cf58080b53e011a64671584").fetch();
  expect(b.name).toBe("The Return Of The King");
});

test("retrieves books by regexp", async () => {
  const { Book } = makeLOTRApi({ fetch });
  const b = await Book.search({ name: ["rexp", "of"] });
  expect(b.length).toBe(2);
});
