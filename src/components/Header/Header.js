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
        <div className="flex-row">
          <IonTitle>Workout Tracker</IonTitle>
          {
            firebase.auth().currentUser &&
            <div className="flex-row">
              <p className="signed-in-as">Signed in as {firebase.auth().currentUser.displayName}</p>
              <img className="hard-shadow" src={firebase.auth().currentUser.photoURL} />
              <IonButton
              className="ion-button hover-scale"
              onClick={signOut}
              >
              Sign Out
              </IonButton>
            </div>
          }
        </div>
      </IonToolbar>
    </IonHeader>
  );
}

export default Header;
