import { IonButton } from '@ionic/react';

import './SignIn.css';

import firebase from 'firebase/app';

function SignIn() {
  // opens google sign in popup
  function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  return (
    <div className="SignIn">
      <IonButton onClick={signInWithGoogle}>Sign in with Google</IonButton>
    </div>
  )
}

export default SignIn;
