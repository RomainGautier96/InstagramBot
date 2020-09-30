const firebase = require('firebase-admin');
const config = require('./config/db_config.json');

firebase.initializeApp({
    credential: firebase.credential.cert(config),
    databaseURL: "https://instagrambot-d1b2b.firebaseio.com"
  });

  let database = firebase.database();

  const writeUserData = async (utilisateurs)=>{
      await database.ref('users/' + utilisateurs['name']).set({
          username: utilisateurs['name']
      });
  }

  module.exports = {
      writeUserData,
  };