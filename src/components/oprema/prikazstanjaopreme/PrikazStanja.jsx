import React, { Suspense, useState, lazy, useEffect } from "react";
import "./prikazstanja.scss";
import { useLoaderData } from "react-router-dom";
import { DotLoader } from "react-spinners";
import axios from "axios";

const ZaduziTable = lazy(() =>
  import("../../home/zaduzi/zaduzitable/ZaduziTable")
);

function PrikazStanja() {
  const { rezultatZaduzivanja } = useLoaderData();
  const [zaduzivanje, setZaduzivanje] = useState(rezultatZaduzivanja);
  const [prikazOprema, setPrikazOprema] = useState(false);
  const [oprema, setOprema] = useState([]);
  const [actions, setActions] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleSortNaziv = async () => {
    setPrikazOprema(true);
    const response = (
      await axios.get("https://localhost:7121/api/oprema/sortpernaziv")
    ).data;
    setOprema(response);
  };
  const handleSortKolicina = async () => {
    setPrikazOprema(true);

    const response = (
      await axios.get("https://localhost:7121/api/oprema/sortperkolicina")
    ).data;
    setOprema(response);
  };

  const handleGroupZaposleni = async () => {
    const data = (
      await axios.get("https://localhost:7121/api/zaduzivanje/groupzaposleni")
    ).data;

    setZaduzivanje(data);
    setPrikazOprema(false);
    setActions(false);
  };
  const handleGroupKabinet = async () => {
    const data = (
      await axios.get("https://localhost:7121/api/zaduzivanje/groupkabinet")
    ).data;
    setZaduzivanje(data);
    setPrikazOprema(false);
    setActions(false);
  };

  const handleRestartPrikaz = async () => {
    setPrikazOprema(false);
    setOprema([]);
    rezultatZaduzivanja.then((zad) => setZaduzivanje(zad.zaduzivanja));
    setActions(true);
  };

  useEffect(() => {
    rezultatZaduzivanja.then((zad) => {
      setZaduzivanje(zad.zaduzivanja);
      setLoading(false);
    });
  }, []);
  return (
    <>
      <div className="prikaz-stanja-section">
        <div>
          <div className="prikaz-group sortiraj-group">
            <h2>Prikaz opreme</h2>
            <h2>Sortiraj</h2>
            <div className="prikaz-buttons">
              <button
                className="btn-full btn-sortiraj-naziv"
                onClick={handleSortNaziv}
              >
                Naziv
              </button>
              <button
                className="btn-full btn-sortiraj-kolicina"
                onClick={handleSortKolicina}
              >
                Kolicna
              </button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2>Resetuj prikaz</h2>
            <img
              src="/restart.png"
              alt=""
              style={{
                width: "2.5rem",
                margin: "0 auto 40px auto",
                cursor: "pointer",
              }}
              onClick={handleRestartPrikaz}
            />
          </div>
          <div className="prikaz-group grupisi-group">
            <h2>Prikaz zaduzivanja</h2>
            <h2>Grupisi</h2>
            <div className="prikaz-buttons">
              <button
                className="btn-full btn-grupisi-zaposleni"
                onClick={handleGroupZaposleni}
              >
                Zaposleni
              </button>
              <button
                className="btn-full btn-grupisi-kabinet"
                onClick={handleGroupKabinet}
              >
                Kabinet
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            {/* OCAJNA DOKUMENTACIJA */}
            <DotLoader color="#55d111" size={70} />
          </div>
        ) : (
          <ZaduziTable
            prikaziDugme={false}
            zaduzivanja={zaduzivanje}
            prikazOprema={prikazOprema}
            oprema={oprema}
            actions={actions}
          />
        )}
      </div>
    </>
  );
}

export default PrikazStanja;
