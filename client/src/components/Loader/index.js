import { h, Component } from "preact";
import { Link } from "preact-router";
import "./styles.scss";

const loader = () => (
  <div className="loader-container">
    <img src={require("../../assets/loader.svg")} />
  </div>
);

export default loader;
