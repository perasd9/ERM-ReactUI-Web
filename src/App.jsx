import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import Oprema from "./components/oprema/Oprema";
import "./App.css";
import { formZaduziLoader } from "./components/home/zaduzi/formzaduzi/formZaduziLoader";
import { commonOpremaLoader } from "./components/oprema/commonOpremaLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorPage from "./ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: formZaduziLoader,
    errorElement: <ErrorPage />,
  },
  {
    path: "oprema",
    element: <Oprema />,
    loader: commonOpremaLoader,
    errorElement: <ErrorPage />,
  },
]);
function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
