import React from "react";
import Navbar from "../navbar/Navbar";
import FormDodaj from "./formdodajopremu/FormDodaj";
import PrikazStanja from "./prikazstanjaopreme/PrikazStanja";

function Oprema() {
  return (
    <>
      <Navbar />
      <FormDodaj />
      <PrikazStanja />
    </>
  );
}

export default Oprema;
