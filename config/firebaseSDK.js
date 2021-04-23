import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

class FirebaseSDK {
  constructor() {
    if (!firebase.apps.length) {
      //avoid re-initializing
      firebase.initializeApp({
        apiKey: 'AIzaSyAQ2ZoT42Bo6AlzxhrIbWB3NNvy18GKAOE',
        authDomain: 'chat-3df9d.firebaseapp.com',
        databaseURL: 'https://chat-3df9d-default-rtdb.firebaseio.com/',
        projectId: 'chat-3df9d',
        storageBucket: 'chat-3df9d.appspot.com',
        messagingSenderId: '891707416808',
      });
    }
  }
  login = async (user, success_callback, failed_callback) => {
    await firebase
      .auth()
      .signInWithEmailAndPassword(user.email, user.password)
      .then(success_callback, failed_callback);
  };
}
const firebaseSDK = new FirebaseSDK();
export default firebaseSDK;
