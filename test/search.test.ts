import { searchSpecAsParm } from "../src/search";

test("include search works", async () => {
  const parm = searchSpecAsParm("race", ["inc", ["Hobbit", "Human"]]);
  expect(parm).toBe("race=Hobbit,Human");
});

test("exclude search works", async () => {
  const parm = searchSpecAsParm("race", ["exc", ["Orc", "Goblin"]]);
  expect(parm).toBe("race!=Orc,Goblin");
});
