import { h, Component } from "preact";
import { connect } from "unistore/preact";
import "./style";

import Loader from "../../components/Loader";
import Error from "../../components/Error";

const connector = connect(
  state => ({}),
  () => ({
    updateSecret(state, secret) {
      state.user.secret = secret;
      return state;
    }
  })
);

class Login extends Component {
  constructor(props) {
    super(props);

    this.states = {
      LOADING: "LOADING",
      ERROR: "ERROR",
      COMPLETE: "COMPLETE"
    };

    this.state = {
      status: this.states.LOADING,
      url: null
    };
  }

  componentDidMount() {
    this.request();
  }

  request() {
    this.setState(
      () => ({ status: this.states.LOADING }),
      () => {
        fetch("/api/tumblr/request-token-url")
          .then(res => res.json())
          .then(({ URL, Secret }) => {
            this.setState(() => ({
              status: this.state.COMPLETE,
              url: URL
            }));
            this.updateSecret(Secret);
          })
          .catch(err => {
            this.setState(() => ({
              status: this.state.ERROR
            }));
          });
      }
    );
  }

  render() {
    switch (this.state.status) {
      case this.states.LOADING: {
        return <Loader />;
      }
      case this.states.ERROR: {
        return <Error tryAgain={() => this.request()} />;
      }
      default: {
        return (
          <div className="login-container">
            <a href={this.state.url}>
              <button>LOGIN</button>
            </a>
          </div>
        );
      }
    }
  }
}

export default connector(Login);
