// general imports
import React, { useState, useEffect } from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';
import { currentDate } from '../../util/currentDate';

// components
import Workout from '../../components/Workout/Workout';

// firebase
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// style
import './StudentHome.css';

// StudentHome component
function StudentHome() {
  const [groupId, setGroupId] = useState('');

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  // get workouts from firebase
  const workoutsQuery = firebase.firestore().collection('workouts')
  .where('groupId', '==', groupId ? groupId : 'null')
  .where('date', '==', currentDate ? currentDate : 'null');
  const [workouts] = useCollectionData(workoutsQuery, {idField: 'id'});

  // if no groups yet, return loading page
  if (!groups) {
    return (
      <div className="StudentHome">
        <p className="margin-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="StudentHome center-box">
      <h1 className="welcome-text">
      Welcome to Workout Tracker!<br />Please select a group.
      </h1>
      {/* group input */}
      <IonItem>
        <IonLabel>Select Group</IonLabel>
        <IonSelect value={groupId} onIonChange={e => setGroupId(e.target.value)}>
        {
          // map all groups to select options
          groups.map(g =>
            <IonSelectOption key={g.id} value={g.id}>{g.name}</IonSelectOption>
          )
        }
        </IonSelect>
      </IonItem>
      {
        // if group chosen, show workouts list
        groupId &&
        <div className="workouts-list">
        {
          // if workouts loaded
          workouts ?
          <>
            {
              // if workouts exist
              workouts.length > 0 ?
              <>
                {
                  // map workouts to workout components
                  workouts.map(w => <Workout key={w.id} data={w} />)
                }
              </> :
              <p className="no-bottom">No workouts for today</p>
            }
          </> :
          <p className="no-bottom">Loading workouts...</p>
        }
      </div>
      }
    </div>
  );
}

export default StudentHome;
