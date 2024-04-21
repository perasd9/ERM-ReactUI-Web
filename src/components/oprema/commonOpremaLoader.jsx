import { formDodajOpremuLoader } from "./formdodajopremu/formDodajOpremuLoader";
import { prikazStanjaLoader } from "./prikazstanjaopreme/prikazStanjaLoader";

export async function commonOpremaLoader() {
  //razlog za common naziv je jer na jednu rutu odnosno komponentu ne mozemo postaviti vise loader, moze niz zapravo ali zahteva neke dodatne stavke, pa se onda 2 loadera za jednu rutu wrapuju u jedan i odavde se vuku rezultati, razlog sto treba 2 loadera za jednu rutu a ne da satvimo posebno po jedan za komponente je taj da imamo dodajOpremu i prikazStanja komponente koje su na istom nivou pa im je samo Oprema zajednicka odnosno roditelj i jednom i drugom pa mora odatle da poteknu oba loadera
  const rezultatTipoviOpreme = await formDodajOpremuLoader();
  const rezultatZaduzivanja = prikazStanjaLoader();

  return { rezultatTipoviOpreme, rezultatZaduzivanja };
}
