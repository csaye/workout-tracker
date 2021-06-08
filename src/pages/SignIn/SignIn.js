// general imports
import { IonButton } from '@ionic/react';
import logo from '../../img/logo.png';
import wick from '../../img/wick.png';

// firebase
import firebase from 'firebase/app';

// style
import './SignIn.css';

// SignIn component
function SignIn() {
  // opens google sign in popup
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return (
    <div className="SignIn center-box">
      <img className="logo" src={logo} />
      <img className="wick" src={wick} />
      <img className="logo" src={logo} style={{transform: 'scaleX(-1)'}} />
      <h1>Workout Tracker</h1>
      <IonButton
      className="ion-button hover-scale"
      onClick={signInWithGoogle}
      >
      Sign in with Google
      </IonButton>
    </div>
  )
}

export default SignIn;
