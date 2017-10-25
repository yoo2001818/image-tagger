var path = require('path');
module.exports = {
  network: {
    port: 8000,
    host: '0.0.0.0',
  },
  directory: path.resolve(__dirname, '..', 'photos'),
};
