import { IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';

import './Header.css';

import firebase from 'firebase/app';

function Header() {
  // signs out current user
  function signOut() {
    firebase.auth().signOut();
  }

  return (
    <IonHeader className="Header">
      <IonToolbar>
        <div className="toolbar-items">
          <IonTitle>Workout Tracker</IonTitle>
          {
            firebase.auth().currentUser &&
            <div className="auth-items">
              <p>Signed in as {firebase.auth().currentUser.displayName}</p>
              <img src={firebase.auth().currentUser.photoURL} />
              <IonButton className="ion-button" onClick={signOut}>Sign Out</IonButton>
            </div>
          }
        </div>
      </IonToolbar>
    </IonHeader>
  );
}

export default Header;
