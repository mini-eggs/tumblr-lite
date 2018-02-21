import createStore from "unistore";

const initialState = {
  user: {},
  dashboard: {
    posts: []
  }
};

const store = createStore(initialState);

export const persist = () => {
  store.subscribe(state => {
    const next = Object.assign({}, { user: state.user });
    localStorage.setItem("TumblrLite:persist", JSON.stringify(next));
  });
  try {
    const saved = localStorage.getItem("TumblrLite:persist");
    store.setState(JSON.parse(saved));
  } catch (_) {}
};

export default store;
