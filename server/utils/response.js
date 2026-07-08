// Provides a consistent API response shape.
function success(data = null, message = 'ok') {
  return { code: 0, data, message };
}

function fail(message = 'Server error') {
  return { code: -1, data: null, message };
}

module.exports = { success, fail };
