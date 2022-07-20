import { fetch } from "./selectFetch";
import { makeLOTRApi } from "../src/api";

test("retrieves chapter", async () => {
  const { Chapter } = makeLOTRApi({ fetch });
  const c = await Chapter.get("6091b6d6d58360f988133bb6").fetch();
  expect(c.name).toBe("Minas Tirith");
});

test("retrieves chapter and then the book it belongs to", async () => {
  const { Chapter } = makeLOTRApi({ fetch });
  const c = await Chapter.get("6091b6d6d58360f988133bb6").fetch();
  const b = await c.book.fetch();
  expect(b.name).toBe("The Return Of The King");
});
