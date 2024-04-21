import { useRouteError } from "react-router-dom";
import "./App.scss";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="errorMessage">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
