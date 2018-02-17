import { h, Component } from "preact";
import { connect } from "unistore/preact";
import "./style";

import Loader from "../../components/Loader";
import Error from "../../components/Error";

const Post = props => <div>post name here</div>;

const connector = connect(
  state => ({
    posts: state.dashboard.posts
  }),
  () => ({
    request(state, { limit, offset }) {
      return new Promise(resolve => {
        fetch(`/api/tumblr/dashboard?offset=${offset}&limit=${limit}`)
          .then(res => res.json())
          .then((posts = []) => {
            state.dashboard.posts = posts;
            resolve(state);
          })
          .catch(() => {
            state.dashboard.posts = [];
            resolve(state);
          });
      });
    }
  })
);

export default connector(
  class extends Component {
    constructor(props) {
      super(props);

      this.states = {
        FAILED: "FAILED",
        COMPLETE: "COMPLETE",
        LOADING: "LOADING"
      };

      this.state = {
        offset: 0,
        limit: 10,
        status: this.states.LOADING
      };
    }

    componentDidMount() {
      this.props.request(this.requestProps);
    }

    retryRequest() {
      this.setState(
        () => ({ status: this.LOAD_STATUS }),
        () => this.props.request(this.requestProps)
      );
    }

    componentWillReceiveProps(next) {
      if (next.posts.length > this.props.posts.length) {
        this.setState(() => ({ status: this.states.COMPLETE }));
      } else if (next.posts.length === 0) {
        this.setState(() => ({ status: this.states.FAILED }));
      }
    }

    get requestProps() {
      const { offset, limit } = this.state;
      return { offset, limit };
    }

    render() {
      switch (this.state.status) {
        case this.states.LOADING: {
          return <Loader />;
        }
        case this.states.COMPLETE: {
          return <div>{this.props.posts.map(i => <Post {...i} />)}</div>;
        }
        case this.states.FAILED:
        default: {
          return <Error tryAgain={() => this.retryRequest()} />;
        }
      }
    }
  }
);
