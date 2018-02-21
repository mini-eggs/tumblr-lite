import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { route } from "preact-router";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import "./style";

const connector = connect(state => ({}), () => ({}));

class Auth extends Component {
  constructor(props) {
    super(props);

    this.states = {
      LOADING: "LOADING",
      ERROR: "ERROR"
    };

    this.state = {
      status: this.states.LOADING
    };
  }

  componentDidMount() {
    const { oauth_verifier } = this.props.matches;
    if (typeof oauth_verifier === "string" && oauth_verifier.length > 0) {
      this.requestFullAuth();
    } else {
      this.setState(() => ({ status: this.states.ERROR }));
    }
  }

  requestFullAuth() {
    const { oauth_verifier } = this.props.matches;
    const url = `/api/tumblr/receive-token-url?oauth_verifier=${oauth_verifier}`;
    fetch(url, { credentials: "same-origin" })
      .then(res => res.json())
      .then(() => {
        route("/dashboard");
      })
      .catch(() => {
        this.setState(() => ({ status: this.states.ERROR }));
      });
  }

  render() {
    switch (this.state.status) {
      case this.states.LOADING: {
        return <Loader />;
      }
      case this.states.ERROR: {
        return <Error tryAgain={() => route("/login")} />;
      }
      default: {
        return null;
      }
    }
  }
}

export default connector(Auth);
