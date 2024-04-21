import React, { useEffect, useRef, useState } from "react";
import "./formzaduzi.css";
import ZaduziTable from "../zaduzitable/ZaduziTable";
import { useLoaderData } from "react-router-dom";

function FormZaduzi() {
  const { zaposleni, oprema } = useLoaderData();
  const [zaduzivanja, setZaduzivanja] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const btnDodaj = useRef(null);
  const [zaduzivanjaZaSlanje, setZaduzivanjaZaSlanje] = useState([]);
  const [formValues, setFormValues] = useState({
    zaposleni: zaposleni[0],
    oprema: oprema[0],
    brojKomada: 0,
  });
  const handleDodajZaduzivanje = () => {
    if (formValues.zaposleni == null) {
      toast.error("Zaposleni ne moze biti nepoznat!");

      return;
    }
    if (formValues.oprema == null) {
      toast.error("Oprema ne moze biti nepoznata!");

      return;
    }
    setZaduzivanja((zaduzivanja) => [
      //razlog za zaduzivanje za slanje je taj da u zaduzivanjima imamo cele objekte sa svim poljima
      //a u zaduzivanjima za slanje smo postavili samo spoljne kljuceve koji su potrebni da bi se unelo zaduzivanje
      //MOZE DRUGACIJE
      ...zaduzivanja,
      {
        zaposleni: formValues.zaposleni,
        oprema: formValues.oprema,
        datumZaduzivanja: new Date().toLocaleDateString(),
        brojKomada: formValues.brojKomada,
        kabinet: formValues.zaposleni.kabinet,
      },
    ]);
    setZaduzivanjaZaSlanje((zaduzivanjaZaSlanje) => [
      ...zaduzivanjaZaSlanje,
      {
        email: formValues.zaposleni.email,
        serijskiBroj: formValues.oprema.serijskiBroj,
        datumZaduzivanja: new Date().toISOString(),
        brojKomada: formValues.brojKomada,
        kabinetId: formValues.zaposleni.kabinet.kabinetId,
      },
    ]);
  };

  //Validacija polja
  const validate = async (values) => {
    const errors = {};

    if (!values.brojKomada)
      errors.brojKomada =
        "Broj komada je obavezan i sme sadrzati samo brojeve!";
    else if (values.brojKomada <= 0)
      errors.brojKomada = "Broj komada mora biti veci od nule!";
    else if (values.brojKomada > 30)
      errors.brojKomada = "Ne mozete zaduziti vise od 30 komada!";
    return errors;
  };

  //Regulisanje ponasanja u slucaju uspesne/neuspesne validacije
  useEffect(() => {
    (async () => {
      const errors = await validate(formValues);
      setFormErrors({
        ...formErrors,
        brojKomada: errors.brojKomada,
      });

      if (Object.keys(errors).length != 0) {
        btnDodaj.current?.classList.add("disabled");
      } else btnDodaj.current?.classList.remove("disabled");
    })();
  }, [formValues]);

  return (
    <>
      <div className="zaduziForm" id="zaduziNavigate">
        <div className="zaduzi-heading">
          <h1>Zaduzi opremu</h1>
          <div className="zaduzi-form-groups">
            <div className="zaduzi-form-fields">
              <label htmlFor="zaposleni">Zaposleni</label>
              <select
                className="control"
                name="zaposleni"
                id=""
                defaultValue={formValues.zaposleni}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    zaposleni: zaposleni.find((z) => z.email == e.target.value),
                  })
                }
              >
                {zaposleni.map((zaposlen, index) => {
                  return (
                    <option
                      value={zaposlen.email}
                      key={zaposleni.email || index}
                    >
                      {zaposlen.email}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="zaduzi-form-fields">
              <label htmlFor="oprema">Oprema</label>
              <select
                className="control"
                name="oprema"
                id=""
                defaultValue={formValues.oprema}
                onChange={(e) => {
                  setFormValues({
                    ...formValues,
                    oprema: oprema.find(
                      (op) => op.serijskiBroj == e.target.value
                    ),
                  });
                }}
              >
                {oprema.map((op, index) => {
                  return (
                    <option
                      value={op.serijskiBroj}
                      key={op.serijskiBroj || index}
                    >
                      {op.naziv}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="zaduzi-form-fields">
              <label htmlFor="oprema">Broj komada</label>
              <input
                className="control"
                type="number"
                value={formValues.brojKomada}
                onChange={async (e) => {
                  setFormValues({
                    ...formValues,
                    brojKomada: e.target.value,
                  });
                }}
              />
              <p>{formErrors.brojKomada}</p>
            </div>
          </div>
          <div className="dodaj-zaduzenje">
            <button
              className="btn-full btn-dodaj-zaduzenje"
              onClick={handleDodajZaduzivanje}
              ref={btnDodaj}
            >
              Dodaj
            </button>
          </div>

          <ZaduziTable
            prikaziDugme={true}
            zaduzivanja={zaduzivanja}
            prikazOprema={false}
            zaduzivanjaZaSlanje={zaduzivanjaZaSlanje}
            setZaduzivanja={setZaduzivanja}
            setZaduzivanjaZaSlanje={setZaduzivanjaZaSlanje}
            actions={false}
          />
        </div>
      </div>
    </>
  );
}

export default FormZaduzi;
