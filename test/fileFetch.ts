import fs from "fs/promises";

const dir: Record<string, string> = {
  book: "test/data/books.json",
  "book/5cf58080b53e011a64671584": "test/data/book.json",
  "book/5cf58080b53e011a64671584/chapter": "test/data/chapters.json",
  "chapter/6091b6d6d58360f988133bb6": "test/data/chapter.json",
  character: "test/data/characters.json",
  movie: "test/data/movies.json",
  quote: "test/data/quotes.json",
  "character/5cd99d4bde30eff6ebccfbbe": "test/data/character.json",
};

export const fetch = async (n: string) => {
  const file = await fs.open(dir[n], "r");
  try {
    const d = await file.readFile("utf-8");
    return JSON.parse(d);
  } finally {
    file.close();
  }
};
