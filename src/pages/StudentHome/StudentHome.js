import React, { useState } from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';

import Workout from '../../components/Workout/Workout';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function StudentHome() {
  const [group, setGroup] = useState('');

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  const workoutsQuery = firebase.firestore().collection('workouts')
  .where('group', '==', group ? group : 'null');
  const [workouts] = useCollectionData(workoutsQuery, {idField: 'id'});

  if (!groups) {
    return (
      <div className="StudentHome">
        <p className="margin-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="StudentHome center-box">
      <IonItem>
        <IonLabel>Select Group</IonLabel>
        <IonSelect value={group} onIonChange={e => setGroup(e.target.value)}>
        {
          groups.map(g =>
            <IonSelectOption key={g.id} value={g.id}>{g.name}</IonSelectOption>
          )
        }
        </IonSelect>
      </IonItem>
      {
        group &&
        <div className="workouts-list">
        {
          workouts ?
          <>
            {
              workouts.length > 0 ?
              <>
                {
                  workouts.map(w => <Workout key={w.id} data={w} />)
                }
              </> :
              <p>No workouts yet</p>
            }
          </> :
          <p className="margin-sm">Loading workouts...</p>
        }
      </div>
      }
    </div>
  );
}

export default StudentHome;
