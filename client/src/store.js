import createStore from "unistore";

const initialState = {
  user: {
    token: null,
    secret: null,
    oauth_token: null,
    oauth_verifier: null
  },
  dashboard: {
    posts: []
  }
};

const store = createStore(initialState);

export default store;
