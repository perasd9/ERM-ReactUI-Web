import axios from "axios";

export async function formDodajOpremuLoader() {
  const tipoviOpreme = (await axios.get("https://localhost:7121/api/tipOpreme"))
    .data;

  const podtipoviOpreme = (
    await axios.get(
      `https://localhost:7121/api/tipOpreme/subtypes?subtype=${tipoviOpreme[0].tipOpremeId}`
    )
  ).data;

  return { tipoviOpreme, podtipoviOpreme };
}
