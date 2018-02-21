import { h, Component } from "preact";
import { connect } from "unistore/preact";
import { route } from "preact-router";
import UniqBy from "lodash/uniqBy";
import "./style";

import Loader from "../../components/Loader";
import Error from "../../components/Error";
import ListPost from "../../components/ListPost";

const connector = connect(
  state => ({
    posts: state.dashboard.posts
  }),
  () => ({
    request(state, { limit, offset }) {
      return new Promise(resolve => {
        const url = `/api/tumblr/dashboard?offset=${offset}&limit=${limit}`;
        fetch(url, { credentials: "same-origin" })
          .then(res => res.json())
          .then((posts = []) => {
            state.dashboard.posts = [...state.dashboard.posts, ...posts];
            state.dashboard.posts = UniqBy(state.dashboard.posts, "id");
            resolve(state);
          })
          .catch(() => {
            state.dashboard.posts = [...state.dashboard.posts];
            state.dashboard.posts = UniqBy(state.dashboard.posts, "id");
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
        LOADING: "LOADING",
        LOADING_NEXT: "LOADING_NEXT"
      };

      this.state = {
        offset: 0,
        limit: 10,
        status: this.states.LOADING,
        canLoadMore: false
      };

      this.renderList = this.renderList.bind(this);
      this.next = this.next.bind(this);
      this.renderFooter = this.renderFooter.bind(this);
    }

    componentDidMount() {
      this.props.request(this.state);
    }

    retryRequest() {
      this.setState(
        () => ({ status: this.LOAD_STATUS }),
        () => this.props.request(this.requestProps)
      );
    }

    componentWillReceiveProps(next) {
      const canLoadMore = next.posts.length > 0;
      if (next.posts.length > this.props.posts.length) {
        this.setState(() => ({ status: this.states.COMPLETE, canLoadMore }));
      } else if (next.posts.length === 0) {
        this.setState(() => ({ status: this.states.FAILED, canLoadMore }));
      }
    }

    next() {
      this.setState(
        () => ({
          offset: this.state.offset + this.state.limit,
          status: this.states.LOADING_NEXT
        }),
        () => {
          this.props.request(this.state);
        }
      );
    }

    renderList() {
      return <div>{this.props.posts.map(i => <ListPost {...i} />)}</div>;
    }

    renderFooter({ loading, canLoadMore }) {
      return (
        <div className="dashboard-footer-container">
          {loading && <Loader />}
          {canLoadMore && (
            <div className="pagination">
              <button onCLick={this.next}>NEXT</button>
            </div>
          )}
        </div>
      );
    }

    render() {
      switch (this.state.status) {
        case this.states.LOADING: {
          return <Loader />;
        }
        case this.states.LOADING_NEXT: {
          return (
            <div>
              <this.renderList />
              <this.renderFooter loading={true} canLoadMore={false} />
            </div>
          );
        }
        case this.states.COMPLETE: {
          return (
            <div>
              <this.renderList />
              <this.renderFooter
                loading={false}
                canLoadMore={this.state.canLoadMore}
              />
            </div>
          );
        }
        case this.states.FAILED:
        default: {
          // return <Error tryAgain={() => this.retryRequest()} />;
          // TODO: refine error message.
          return (
            <Error
              tryAgain={() => route("/login")}
              btnText="LOGIN"
              errorMessage="Not logged in?"
            />
          );
        }
      }
    }
  }
);
