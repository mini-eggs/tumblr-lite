import { h, Component } from "preact";
import { Link } from "preact-router";
import "./styles";

class Header extends Component {
  render() {
    return (
      <header className="header-container">
        <nav>
          <Link to="/">
            <img src={require("../../assets/feather.svg")} />
          </Link>
        </nav>
      </header>
    );
  }
}

export default Header;
