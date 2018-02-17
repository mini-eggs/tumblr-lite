import { h, Component } from "preact";
import { Router, route } from "preact-router";
import { Provider } from "unistore/preact";

import Store from "../store";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../routes/Login";
import Auth from "../routes/Auth";
import Dashboard from "../routes/Dashboard";

if (module.hot) {
  require("preact/debug");
}

class Redirect extends Component {
  componentDidMount() {
    route(this.props.to);
  }
  render() {
    return null;
  }
}

const app = () => (
  <Provider store={Store}>
    <div>
      <Header />
      <Router>
        <Redirect path="/" to="/login" />
        <Login path="/login" />
        <Auth path="/auth" />
        <ProtectedRoute path="/dashboard">
          {props => <Dashboard {...props} />}
        </ProtectedRoute>
      </Router>
    </div>
  </Provider>
);

export default app;
