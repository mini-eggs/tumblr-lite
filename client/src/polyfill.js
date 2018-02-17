Object.defineProperty(Array.prototype, "first", {
  get: function() {
    return [...this].pop();
  }
});
