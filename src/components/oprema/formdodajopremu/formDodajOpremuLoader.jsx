import axios from "axios";

export async function formDodajOpremuLoader() {
  const tipoviOpreme = (await axios.get("https://localhost:7121/api/tipOpreme"))
    .data;

  return { tipoviOpreme };
}
