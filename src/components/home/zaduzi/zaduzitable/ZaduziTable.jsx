import React, { useEffect, useRef } from "react";
import "./zaduzitable.scss";
import axios from "axios";
import { toast } from "react-toastify";

//komponenta Table je bila ponovno koriscena dosta puta pa odatle ovoliko propsova i dalje u kodu raznih provera da li se ispunjavaju odredjeni uslovi koji se prosledjuju kroz propsove da bi komponenta zapravo stvarno sluzila tome cemu treba u tom trenutku koriscenja
function ZaduziTable({
  prikaziDugme,
  zaduzivanja,
  prikazOprema = false,
  oprema,
  zaduzivanjaZaSlanje,
  setZaduzivanja,
  setZaduzivanjaZaSlanje,
  actions = false,
}) {
  //btnZaduzi sluzi samo za disable ili enable u slucaju da su ispunjeni uslovi da moze da se salje zahtev serveru
  const btnZaduzi = useRef(null);

  const handleZaduziSvuOpremu = async (e) => {
    e.preventDefault();

    try {
      //salje se lista svih zaduzeznja za slanje za upis u bazu
      const response = await axios.post(
        "https://localhost:7121/api/zaduzivanje",
        zaduzivanjaZaSlanje,
        {
          "Content-Type": "application/json",
        }
      );

      if (response.status == 200) {
        toast.success(
          "Uspesno ste zaduzili sve stavke koje ispunjavaju uslove",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
      setZaduzivanja([]);
      setZaduzivanjaZaSlanje([]);
    } catch (error) {
      toast.error("Doslo je do greske! " + error.response.data);
    }
  };

  //razduzivanje opreme
  const handleRazduziOpremu = async (e) => {
    e.preventDefault();

    try {
      const index = e.currentTarget.getAttribute("data-index");

      const zaduzivanjeZaUpdate = zaduzivanja[index];

      zaduzivanjeZaUpdate.datumRazduzivanja = new Date().toISOString();
      // salje se zahtev za razduzivanje
      const response = await axios.post(
        "https://localhost:7121/api/zaduzivanje/razduzi",
        {
          zaduzivanjeId: zaduzivanjeZaUpdate.zaduzivanjeId,
          email: zaduzivanjeZaUpdate.zaposleni.email,
          serijskiBroj: zaduzivanjeZaUpdate.oprema.serijskiBroj,
          datumZaduzivanja: zaduzivanjeZaUpdate.datumZaduzivanja,
          datumRazduzivanja: zaduzivanjeZaUpdate.datumRazduzivanja,
          brojKomada: zaduzivanjeZaUpdate.brojKomada,
          kabinetId: zaduzivanjeZaUpdate.kabinet.kabinetId,
        },
        {
          "Content-Type": "application/json",
        }
      );

      if (response.status == 200) {
        toast.success("Uspesno ste razduzili opremu", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Doslo je do greske! " + error.response.data);
    }
  };

  //rashodovanje opreme
  const handleRashodujOpremu = async (e) => {
    e.preventDefault();

    try {
      const index = e.currentTarget.getAttribute("data-index");

      const opremaZaRashodovanje = oprema[index];

      // salje se zahtev za rashodovanje opreme
      const response = await axios.post(
        "https://localhost:7121/api/oprema/rashodovanje",
        {
          serijskiBroj: opremaZaRashodovanje.serijskiBroj,
        },
        {
          "Content-Type": "application/json",
        }
      );

      if (response.status == 200) {
        toast.success("Uspesno ste rashodovali opremu", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Doslo je do greske! " + error.response.data);
    }
  };

  //otpisivanje opreme
  const handleOtpisiOpremu = async (e) => {
    e.preventDefault();

    try {
      const index = e.currentTarget.getAttribute("data-index");

      const opremaZaOtpisivanje = oprema[index];

      // salje se zahtev za otpisivanje
      const response = await axios.post(
        "https://localhost:7121/api/oprema/otpisivanje",
        {
          serijskiBroj: opremaZaOtpisivanje.serijskiBroj,
        },
        {
          "Content-Type": "application/json",
        }
      );

      if (response.status == 200) {
        toast.success("Uspesno ste otpisali opremu", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      toast.error("Doslo je do greske! " + error.response.data);
    }
  };

  //filtriramo redove u tabeli na klik dugmeta za brisanje
  const handleDeleteRow = async (e) => {
    e.preventDefault();
    const index = e.currentTarget.getAttribute("data-index");

    const filtriranaZaduzivanja = zaduzivanja.filter(
      (_, filterIndex) => filterIndex != index
    );

    zaduzivanja = filtriranaZaduzivanja;
    setZaduzivanja(zaduzivanja);
    setZaduzivanjaZaSlanje(zaduzivanja);
  };

  //ovde proveravamo samo da li je prosledjen prop zaduzivanje da bi se dugme postavilo samim tim tako
  //razllikujemo tabelu za obican prikaz i tabelu koju zapravo treba posmatrati kao listu za unos u bazu odnosno slanje serveru
  useEffect(() => {
    if (zaduzivanja.length != 0)
      btnZaduzi.current?.classList.remove("disabled");
    else btnZaduzi.current?.classList.add("disabled");
  }, [zaduzivanja]);

  return (
    <>
      <div className="table-section">
        <table className="table-zaduzi">
          <thead>
            {prikazOprema ? (
              <tr>
                <th>Naziv</th>
                <th>Inventarski broj</th>
                <th>Kolicina</th>
                <th>Tip opreme</th>
                <th>Status</th>
                <th>Akcije</th>
              </tr>
            ) : (
              <tr>
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].zaposleni != null) && <th>Zaposleni</th>}
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].oprema != null) && <th>Oprema</th>}
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].datumZaduzivanja != null) && (
                  <th>Datum zaduzivanja</th>
                )}
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].datumZaduzivanja != null) && (
                  <th>Datum razduzivanja</th>
                )}
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].brojKomada != 0) && <th>Broj komada</th>}
                {(zaduzivanja[0] == undefined ||
                  zaduzivanja[0].kabinet != null) && <th>Kabinet</th>}
                {zaduzivanja[0] == undefined || (actions && <th>Akcije</th>)}
              </tr>
            )}
          </thead>
          <tbody>
            {prikazOprema
              ? oprema.map((op, index) => {
                  return (
                    <tr key={op.serijskiBroj}>
                      <td>{op.naziv}</td>
                      <td>{op.inventarskiBroj}</td>
                      <td>{op.kolicina}</td>
                      <td>{op.tipOpreme.naziv}</td>
                      <td>{op.stanje.stanje}</td>
                      <td>
                        <button
                          className="btn-delete"
                          style={{
                            width: "90px",
                            height: "100%",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                            backgroundColor: "#24a0ed",
                          }}
                          onClick={handleRashodujOpremu}
                          data-index={index}
                        >
                          Rashoduj
                        </button>
                        <button
                          className="btn-delete"
                          style={{
                            width: "90px",
                            height: "100%",
                            color: "#ffffff",
                            fontSize: "0.9rem",
                            marginLeft: "15px",
                          }}
                          onClick={handleOtpisiOpremu}
                          data-index={index}
                        >
                          Otpisi
                        </button>
                      </td>
                    </tr>
                  );
                })
              : zaduzivanja.map((zaduzivanje, index) => {
                  return (
                    <tr key={zaduzivanje.zaduzivanjeId || index}>
                      {(zaduzivanje == undefined ||
                        zaduzivanje.zaposleni != null) && (
                        <td className="firstTd">
                          {zaduzivanjaZaSlanje != null && (
                            <button
                              className="btn-delete"
                              onClick={handleDeleteRow}
                              data-index={index}
                            >
                              X
                            </button>
                          )}

                          {zaduzivanje.zaposleni.email}
                        </td>
                      )}
                      {(zaduzivanje == undefined ||
                        zaduzivanje.oprema != null) && (
                        <td>{zaduzivanje.oprema.naziv}</td>
                      )}
                      {(zaduzivanje == undefined ||
                        zaduzivanje.datumZaduzivanja != null) && (
                        <td>
                          {new Date(
                            zaduzivanje.datumZaduzivanja
                          ).toDateString()}
                        </td>
                      )}
                      {(zaduzivanje == undefined ||
                        zaduzivanje.datumZaduzivanja != null) && (
                        <td>
                          {zaduzivanje.datumRazduzivanja == null
                            ? "/"
                            : new Date(
                                zaduzivanje.datumRazduzivanja
                              ).toDateString()}
                        </td>
                      )}
                      {(zaduzivanje == undefined ||
                        zaduzivanje.brojKomada != 0) && (
                        <td>{zaduzivanje.brojKomada}</td>
                      )}
                      {(zaduzivanje == undefined ||
                        zaduzivanje.kabinet != null) && (
                        <td>{zaduzivanje.kabinet.naziv}</td>
                      )}
                      {zaduzivanje == undefined ||
                        (zaduzivanje.datumRazduzivanja == undefined &&
                          actions && (
                            <td>
                              <button
                                className="btn-delete"
                                style={{
                                  width: "100px",
                                  height: "100%",
                                  color: "#ffffff",
                                  fontSize: "1rem",
                                }}
                                onClick={handleRazduziOpremu}
                                data-index={index}
                              >
                                Razduzi
                              </button>
                            </td>
                          ))}
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
      {prikaziDugme && (
        <div className="zaduzi-control">
          <button
            className="btn-full btn-zaduzi"
            onClick={handleZaduziSvuOpremu}
            ref={btnZaduzi}
          >
            Zaduzi
          </button>
        </div>
      )}
    </>
  );
}

export default ZaduziTable;
