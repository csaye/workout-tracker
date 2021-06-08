// general imports
import React, { useState, useEffect } from 'react';
import { IonApp, IonContent, IonPage } from '@ionic/react';

// pages
import SignIn from './pages/SignIn/SignIn';
import StudentHome from './pages/StudentHome/StudentHome';
import AdminHome from './pages/AdminHome/AdminHome';

// components
import Header from './components/Header/Header';

// firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from './util/firebaseConfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';

// style
import './App.css';

// core CSS required for Ionic components to work properly
import '@ionic/react/css/core.css';

// basic CSS for apps built with Ionic
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

// optional CSS utils that can be commented out
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// theme variables
import './theme/variables.css';

// initialize firebase
firebase.initializeApp(firebaseConfig);

// App component
function App() {
  // use firebase auth
  useAuthState(firebase.auth());

  return (
    <IonApp>
      <IonPage>
        <Header />
        <IonContent fullscreen>
          <div className="background-img" />
          <Page />
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

// Page component
function Page() {
  const [status, setStatus] = useState('');

  // sets user status based on firebase doc
  async function getStatus() {
    // if user not signed in, clear status and return
    if (!firebase.auth().currentUser) {
      setStatus('');
      return;
    }
    // get user status from firebase
    const uid = firebase.auth().currentUser.uid;
    const userData = await firebase.firestore().collection('users').doc(uid).get();
    setStatus(userData.data()?.isAdmin ? 'admin' : 'student');
    // if no user doc, create user doc
    if (!userData.data()) {
      const currentUser = firebase.auth().currentUser;
      await firebase.firestore().collection('users').doc(currentUser.uid).set({
        email: currentUser.email,
        name: currentUser.displayName,
        uid: currentUser.uid,
        isAdmin: false
      });
    }
  }

  // get user status when auth state changed
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      getStatus();
    });
  });

  // return if loading user status
  if (firebase.auth().currentUser && !status) {
    return (
      <div className="Page">
        <p className="margin-sm loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="Page">
      {
        firebase.auth().currentUser ?
        <>
          {/* if logged in, show corresponding homepage */}
          {
            status === 'admin' ?
            <AdminHome /> :
            <StudentHome />
          }
        </> :
        <>
          {/* if not logged in, show sign in page */}
          <SignIn />
        </>
      }
    </div>
  );
}

export default App;
