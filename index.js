if (process.env.NODE_ENV === 'production') {
  require('./lib/server');
} else {
  require('babel-register');
  require('./src/server');
}
