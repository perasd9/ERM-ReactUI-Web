import axios from "axios";

export async function prikazStanjaLoader() {
  const zaduzivanja = (
    await axios.get(
      "https://localhost:7121/api/zaduzivanje?pageIndex=1&pageSize=3"
    )
  ).data;

  return { zaduzivanja };
}
