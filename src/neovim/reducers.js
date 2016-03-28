export function makeUIReducer(ctx) {
  return (state=ctx, action) => {
    switch (action) {
      default:
        return state;
    }
  }
}

export function makeNeovimReducer(nvim) {
  return (state=nvim, action) => {
    switch (action) {
      default:
        return state;
    }
  }
}

