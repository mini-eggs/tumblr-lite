import { h, Component } from "preact";
import { Link } from "preact-router";
import "./styles";

const error = ({ errorMessage, tryAgain }) => (
  <div className="error-container">
    <p>{errorMessage || "An error has occurred."}</p>
    <button onClick={tryAgain}>TRY AGAIN</button>
  </div>
);

export default error;
