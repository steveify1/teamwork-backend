// eslint-disable-next-line arrow-body-style
exports.sort = async (feeds) => {
  // eslint-disable-next-line prefer-arrow-callback
  return feeds.sort(function (a, b) {
    // eslint-disable-next-line no-nested-ternary
    return ((a.timestamp > b.timestamp) ? 1 : ((b.timestamp > a.timestamp) ? -1 : 0));
  });
};
