import React, { useState, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonContent, IonPage, IonSpinner } from '@ionic/react';
// import { IonReactRouter } from '@ionic/react-router';

import SignIn from './pages/SignIn/SignIn';
import StudentHome from './pages/StudentHome/StudentHome';
import AdminHome from './pages/AdminHome/AdminHome';

import Header from './components/Header/Header';

import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

// firebase
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { firebaseConfig } from './util/firebaseConfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';

// initialize firebase
firebase.initializeApp(firebaseConfig);

function App() {
  // use firebase auth
  useAuthState(firebase.auth());

  return (
    <IonApp>
      <IonPage>
        <Header />
        <IonContent fullscreen className="ion-content">
          {/*<IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Workout Tracker</IonTitle>
            </IonToolbar>
          </IonHeader>*/}
          {/*<Router />*/}
          <Page />
        </IonContent>
      </IonPage>
    </IonApp>
  );
}

function Page() {
  const [status, setStatus] = useState('');

  async function getStatus() {
    if (!firebase.auth().currentUser) {
      setStatus('');
      return;
    }
    // get user status
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

  // get status when auth state changed
  useEffect(() => {
    firebase.auth().onAuthStateChanged(() => {
      getStatus();
    });
  });

  // return if loading user status
  if (firebase.auth().currentUser && !status) {
    return (
      <div className="Page">
        <p className="margin-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="Page">
      {
        firebase.auth().currentUser ?
        <>
          {
            status === 'admin' ?
            <AdminHome /> :
            <StudentHome />
          }
        </> :
        <SignIn />
      }
    </div>
  );
}

// function Router() {
//   return (
//     <IonReactRouter>
//       <IonRouterOutlet>
//         <Route exact path="/signin">
//           <SignIn />
//         </Route>
//         <Route exact path="/">
//           <StudentHome />
//         </Route>
//       </IonRouterOutlet>
//     </IonReactRouter>
//   );
// }

export default App;
