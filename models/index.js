const mongoose = require('mongoose');
let { Schema, Promise, set, plugin, connect, model } = require('mongoose');

const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const user = process.env.DB_USER;
const pass = process.env.DB_PASSWORD;
const dbname = process.env.DB_NAME;
const uri = process.env.DB_URI;
const poolSize = process.env.MONGO_POOL_SIZE || 5;

Promise = global.Promise;
set('useNewUrlParser', true);
set('useFindAndModify', false);
set('useCreateIndex', true);

plugin((schema) => {
  schema.pre('findOneAndUpdate', setRunValidators);
  schema.pre('findByIdAndUpdate', setRunValidators);
  schema.pre('updateMany', setRunValidators);
  schema.pre('updateOne', setRunValidators);
  schema.pre('update', setRunValidators);
});

function setRunValidators() {
  this.setOptions({ runValidators: true });
}

if (uri) {
  connect(uri, { useNewUrlParser: true, poolSize, useUnifiedTopology: true })
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
} else {
  connect(`mongodb://${host}:${port}/${dbname}`, { 
      user,
      pass,
      poolSize,
    })
    .then(() => {
      console.log('connection established');
    })
    .catch((err) => {
      console.log(err);
    });
}

const Event = model('Event', require('./event')(Schema));
const User = model('User', require('./user')(Schema));

module.exports = {
  Event,
  User,
  DB: mongoose,
};