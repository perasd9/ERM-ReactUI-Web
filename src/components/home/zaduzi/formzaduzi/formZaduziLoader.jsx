import axios from "axios";

export async function formZaduziLoader() {
  const zaposleni = (await axios.get("https://localhost:7121/api/zaposleni"))
    .data;
  const oprema = (await axios.get("https://localhost:7121/api/oprema")).data;

  return { zaposleni, oprema, loading: false };
}
