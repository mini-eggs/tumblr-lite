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
        fetch(`/api/tumblr/dashboard/${offset}/${limit}`)
          .then(res => res.json())
          .then(data => {
            state.dashboard.posts = data.posts || [];
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

      this.state = {
        offset: 0,
        limit: 10,
        status: "LOAD_STATUS"
      };

      this.FAIL_STATUS = "FAIL_STATUS";
      this.COMPLETE_STATUS = "COMPLETE_STATUS";
      this.LOAD_STATUS = "LOAD_STATUS";
    }

    componentDidMount() {
      // this.props.request(this.requestProps);
    }

    retryRequest() {
      this.setState(
        () => ({ status: this.LOAD_STATUS }),
        () => this.props.request(this.requestProps)
      );
    }

    componentWillReceiveProps(next) {
      if (next.posts.length > this.props.posts.length) {
        this.setState(() => ({ status: this.COMPLETE_STATUS }));
      } else if (next.posts.length === 0) {
        this.setState(() => ({ status: this.FAIL_STATUS }));
      }
    }

    get requestProps() {
      const { offset, limit } = this.state;
      return { offset, limit };
    }

    render() {
      switch (this.state.status) {
        case this.LOAD_STATUS: {
          return <Loader />;
        }
        case this.COMPLETE_STATUS: {
          return <div>{this.props.posts.map(i => <Post {...i} />)}</div>;
        }
        case this.COMPLETE_STATUS:
        default: {
          return <Error tryAgain={() => this.retryRequest()} />;
        }
      }
    }
  }
);
