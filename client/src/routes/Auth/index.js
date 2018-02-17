import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { route } from "preact-router";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import "./style";

const connector = connect(
  state => ({}),
  () => ({
    updateOAuth(state, { oauth_token, oauth_verifier }) {
      state.user.oauth_token = oauth_token;
      state.user.oauth_verifier = oauth_verifier;
      return state;
    }
  })
);

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
    const { oauth_token, oauth_verifier } = this.props.matches;
    if (
      typeof oauth_token === "string" &&
      oauth_token.length > 0 &&
      typeof oauth_verifier === "string" &&
      oauth_verifier.length > 0
    ) {
      this.props.updateOAuth({ oauth_token, oauth_verifier });
      route("/dashboard");
    } else {
      this.setState(() => ({ status: this.states.ERROR }));
    }
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
