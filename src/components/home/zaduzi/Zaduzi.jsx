import React, { Suspense } from "react";
import { DotLoader } from "react-spinners";

const FormZaduzi = React.lazy(() => {
  return import("./formzaduzi/FormZaduzi");
});

function Zaduzi() {
  return (
    <div className="zaduzi-section">
      <Suspense
        fallback={
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
        }
      >
        <FormZaduzi />
      </Suspense>
    </div>
  );
}

export default Zaduzi;
