import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { route } from "preact-router";

const connector = connect(state => ({
  oauth_token: state.user.oauth_token,
  oauth_verifier: state.user.oauth_verifier
}));

class ProtectedRoute extends Component {
  constructor(props) {
    super(props);

    this.states = {
      LOCKED: "LOCKED",
      OPENED: "OPENED"
    };

    this.state = {
      status: this.states.LOCKED
    };
  }

  componentDidMount() {
    const { oauth_token, oauth_verifier } = this.props;
    if (
      process.env.NODE_ENV !== "production" ||
      (typeof oauth_token === "string" &&
        oauth_token.length > 0 &&
        typeof oauth_verifier === "string" &&
        oauth_verifier.length > 0)
    ) {
      this.setState(() => ({ status: this.states.OPENED }));
    } else {
      route("/");
    }
  }

  render() {
    switch (this.state.status) {
      case this.states.LOCKED: {
        return null;
      }
      default: {
        return this.props.children.first(this.props);
      }
    }
  }
}

export default connector(ProtectedRoute);
