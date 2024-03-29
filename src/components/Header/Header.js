// general imports
import { IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import logo from '../../img/logo.png';

// firebase
import firebase from 'firebase/app';

// style
import './Header.css';

// Header component
function Header() {
  // signs out current user
  function signOut() {
    firebase.auth().signOut();
  }

  return (
    <IonHeader className="Header">
      <IonToolbar>
        <div className="flex-row">
          <img className="logo-img" src={logo} />
          <IonTitle className="ion-title">Workout Tracker</IonTitle>
          {
            // if user signed in, show header auth items
            firebase.auth().currentUser &&
            <div className="flex-row">
              <p className="signed-in-as">Signed in as {firebase.auth().currentUser.displayName}</p>
              <img className="user-img" src={firebase.auth().currentUser.photoURL} />
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
