import React, { useEffect, useRef, useState } from "react";
import "./formdodaj.scss";
import { useLoaderData } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function FormDodaj() {
  const { rezultatTipoviOpreme } = useLoaderData();
  const tipoviOpreme = rezultatTipoviOpreme.tipoviOpreme;
  const [podtipoviOpreme, setPodtipoviOpreme] = useState(
    rezultatTipoviOpreme.podtipoviOpreme
  );
  const [formErrors, setFormErrors] = useState({});
  const btnDodaj = useRef(null);
  const [formValues, setFormValues] = useState({
    naziv: "",
    kolicina: 0,
    inventarskiBroj: "",
    tipOpreme: tipoviOpreme[0].tipOpremeId,
  });

  const [podtipOpreme, setPodtipOpreme] = useState(
    podtipoviOpreme[0].tipOpremeId
  );

  //dodavanje opreme
  const handleDodajOpremu = async (e) => {
    e.preventDefault();
    if (formValues.tipOpreme == null || formValues.tipOpreme == "") {
      toast.error("Tip opreme ne moze biti nepoznat");
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7121/api/oprema",
        {
          naziv: formValues.naziv,
          kolicina: formValues.kolicina,
          inventarskiBroj: formValues.inventarskiBroj,
          tipOpremeId: podtipOpreme,
        },
        {
          "Content-Type": "application/json",
        }
      );
      if (response.status == 200) {
        toast.success("Uspesno dodata oprema", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }

      setFormValues({
        naziv: "",
        kolicina: 0,
        inventarskiBroj: "",
        tipOpreme: tipoviOpreme[0],
      });
    } catch (error) {
      toast.error("Doslo je do greske! " + error.response.data);
    }
  };

  //Validacija polja
  const validate = async (values) => {
    const errors = {};

    if (!values.naziv) errors.naziv = "Naziv je obavezan!";
    else if (values.naziv.length <= 4)
      errors.naziv = "Naziv mora imati najmanje 4 karaktera!";

    if (!values.kolicina)
      errors.kolicina = "Kolicina je obavezna i sme sadrzati samo brojeve!";
    else if (values.kolicina <= 0)
      errors.kolicina = "Kolicina mora biti veci od nule!";

    if (!values.inventarskiBroj)
      errors.inventarskiBroj = "Inventarski broj je obavezan!";
    else if (values.inventarskiBroj.length <= 4)
      errors.inventarskiBroj =
        "Inventarski broj mora imati najmanje 4 karaktera!";

    return errors;
  };

  //setovanje gresaka i enable/disable kad je stanje zadovoljavajuce
  useEffect(() => {
    (async () => {
      const errors = await validate(formValues);
      setFormErrors({
        naziv: errors.naziv,
        kolicina: errors.kolicina,
        inventarskiBroj: errors.inventarskiBroj,
      });

      if (Object.keys(errors).length != 0) {
        btnDodaj.current?.classList.add("disabled");
      } else btnDodaj.current?.classList.remove("disabled");
    })();

    (async () => {
      const response = await axios.get(
        `https://localhost:7121/api/tipOpreme/subtypes?subtype=${formValues.tipOpreme}`
      );
      setPodtipoviOpreme(response.data);
      setPodtipOpreme(response.data[0].tipOpremeId);
    })();
  }, [formValues, formValues.tipOpreme]);

  return (
    <>
      <div className="dodaj-opremu-form">
        <h1>Nova oprema</h1>
        <form action="">
          <div className="form-group">
            <div className="form-fields">
              <label htmlFor="naziv">Naziv</label>
              <input
                type="text"
                name="naziv"
                id=""
                value={formValues.naziv}
                onChange={(e) =>
                  setFormValues({ ...formValues, naziv: e.target.value })
                }
              />
              <p>{formErrors.naziv}</p>
            </div>
            <div className="form-fields">
              <label htmlFor="kolicina">Kolicina</label>
              <input
                type="number"
                name="kolicina"
                id=""
                value={formValues.kolicina}
                onChange={(e) =>
                  setFormValues({ ...formValues, kolicina: e.target.value })
                }
              />
              <p>{formErrors.kolicina}</p>
            </div>
          </div>
          <div className="form-fields">
            <label htmlFor="inventarskiBroj">Inventarski broj</label>
            <input
              type="text"
              name="inventarskiBroj"
              id=""
              value={formValues.inventarskiBroj}
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  inventarskiBroj: e.target.value,
                })
              }
            />
            <p>{formErrors.inventarskiBroj}</p>
          </div>
          <div className="form-fields">
            <label htmlFor="tipOpreme">Tip opreme</label>
            <select
              name="tipOpreme"
              id=""
              value={formValues.tipOpreme}
              onChange={async (e) => {
                setFormValues({ ...formValues, tipOpreme: e.target.value });
              }}
            >
              {tipoviOpreme.map((tipOpreme) => {
                if (tipOpreme.nadtipId == null)
                  return (
                    <option
                      value={tipOpreme.tipOpremeId}
                      key={tipOpreme.tipOpremeId}
                    >
                      {tipOpreme.naziv}
                    </option>
                  );
              })}
            </select>
          </div>
          <div className="form-fields">
            <label htmlFor="tipOpreme">Potdip opreme</label>
            <select
              name="podtipOpreme"
              id=""
              onChange={(e) => setPodtipOpreme(e.target.value)}
            >
              {podtipoviOpreme?.map((tipOpreme) => {
                return (
                  <option
                    value={tipOpreme.tipOpremeId}
                    key={tipOpreme.tipOpremeId}
                  >
                    {tipOpreme.naziv}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="sacuvaj-opremu-btn">
            <button
              className="btn-full"
              onClick={handleDodajOpremu}
              ref={btnDodaj}
            >
              Sacuvaj
            </button>
          </div>
        </form>
      </div>
      <div className="notch"></div>
    </>
  );
}

export default FormDodaj;
