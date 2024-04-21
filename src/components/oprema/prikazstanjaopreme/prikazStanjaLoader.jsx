import axios from "axios";

export async function prikazStanjaLoader() {
  const zaduzivanja = (
    await axios.get("https://localhost:7121/api/zaduzivanje")
  ).data;

  return { zaduzivanja };
}
