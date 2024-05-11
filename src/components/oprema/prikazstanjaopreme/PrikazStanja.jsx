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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchPage = async (page) => {
    setLoading(true);
    const response = await axios.get(
      `https://localhost:7121/api/zaduzivanje?pageIndex=${page}&pageSize=3`
    );
    setZaduzivanje(response.data);
    setLoading(false);
    setCurrentPage(page);
    setHasNextPage(response.data.hasNext);
    setHasPreviousPage(response.data.hasPrevious);
  };

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
    fetchPage(1);
    setActions(true);
  };

  const handleDetaljiOpreme = async (index) => {
    // const index = e.currentTarget.getAttribute("data-index");

    const opremaZaDetalje = oprema[index];

    const data = (
      await axios.get(
        `https://localhost:7121/api/zaduzivanje/peroprema/${opremaZaDetalje.serijskiBroj}`
      )
    ).data;
    setZaduzivanje(data);
    setPrikazOprema(false);
  };

  const handleDetaljiZaposlenog = async (zaposleni) => {
    const zaposleniZaDetalje = zaposleni;

    const data = (
      await axios.get(
        `https://localhost:7121/api/zaduzivanje/perzaposleni/${zaposleniZaDetalje.email}`
      )
    ).data;
    setZaduzivanje(data);
    setPrikazOprema(false);
  };

  const onNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      fetchPage(currentPage + 1);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchPage(currentPage - 1);
    }
  };

  useEffect(() => {
    rezultatZaduzivanja.then((zad) => {
      setZaduzivanje(zad.zaduzivanja);
      setTotalPages(zad.zaduzivanja.totalPages);
      setHasNextPage(zad.zaduzivanja.hasNext);
      setHasPreviousPage(zad.zaduzivanja.hasPrevious);
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
                Kolicina
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
            zaduzivanja={
              zaduzivanje.items === undefined ? zaduzivanje : zaduzivanje.items
            }
            handleDetaljiOpreme={handleDetaljiOpreme}
            handleDetaljiZaposlenog={handleDetaljiZaposlenog}
            prikazOprema={prikazOprema}
            oprema={oprema}
            actions={actions}
          />
        )}
        <ul
          className={`pagination-container ${
            prikazOprema
              ? "hidden"
              : zaduzivanje.items === undefined
              ? "hidden"
              : ""
          }`}
        >
          <li
            className={`pagination-item ${hasPreviousPage ? "" : "disabled"}`}
            onClick={onPrevious}
          >
            <div className="arrow left" />
          </li>

          {Array.from({ length: totalPages }, (_, index) => (
            <>
              {index === 0 && (
                <li
                  key={`firstPage`}
                  className={`pagination-item ${
                    currentPage === index + 1 ? "selected" : ""
                  }`}
                  onClick={() => fetchPage(index + 1)}
                >
                  {index + 1}
                </li>
              )}

              {index === 1 && currentPage - 2 > 0 && (
                <li className="pagination-item dots" key={`dotsBeforeCurrent`}>
                  ...
                </li>
              )}
              {index > 0 &&
                index < totalPages - 1 &&
                index >= currentPage - 1 &&
                index <= currentPage + 1 && (
                  <li
                    key={index}
                    className={`pagination-item ${
                      currentPage === index + 1 ? "selected" : ""
                    }`}
                    onClick={() => fetchPage(index + 1)}
                  >
                    {index + 1}
                  </li>
                )}
              {currentPage != totalPages &&
                index === totalPages - 1 &&
                totalPages - 2 > 1 && (
                  <li
                    className="pagination-item dots"
                    key={`dotsBeforeCurrent`}
                  >
                    ...
                  </li>
                )}
              {index === totalPages - 1 && totalPages - 1 != 0 && (
                <li
                  className={`pagination-item ${
                    currentPage === index + 1 ? "selected" : ""
                  }`}
                  key={`lastPage`}
                  onClick={() => fetchPage(index + 1)}
                >
                  {totalPages}
                </li>
              )}
            </>
          ))}

          <li
            className={`pagination-item ${hasNextPage ? "" : "disabled"}`}
            onClick={onNext}
          >
            <div className="arrow right" />
          </li>
        </ul>
      </div>
    </>
  );
}

export default PrikazStanja;
