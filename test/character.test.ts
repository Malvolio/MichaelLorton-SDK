import { fetch } from "./selectFetch";
import { makeLOTRApi } from "../src/api";

test("retrieves character", async () => {
  const { Character } = makeLOTRApi({ fetch });
  const c = await Character.get("5cd99d4bde30eff6ebccfbbe").fetch();
  expect(c.name).toBe("Adanel");
  expect(c.spouse).toBe("Belemir");
});
