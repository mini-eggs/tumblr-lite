import { h, Component } from "preact";
import { Link } from "preact-router";
import "./styles";

class Header extends Component {
  render() {
    return (
      <div>
        <div style="height: 40px;" />
        <header className="header-container">
          <nav>
            <Link href="/">
              <img src={require("../../assets/feather.svg")} />
            </Link>
          </nav>
        </header>
      </div>
    );
  }
}

export default Header;
