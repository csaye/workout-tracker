import React, { useState, useEffect } from 'react';
import { IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/react';

import Workout from '../../components/Workout/Workout';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function StudentHome() {
  const [groupId, setGroupId] = useState('');

  function formatDate(d) {
    let year = d.getFullYear().toString();
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  // get current date
  const currentDate = formatDate(new Date());

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  const workoutsQuery = firebase.firestore().collection('workouts')
  .where('groupId', '==', groupId ? groupId : 'null')
  .where('date', '==', currentDate ? currentDate : 'null');
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
        <IonSelect value={groupId} onIonChange={e => setGroupId(e.target.value)}>
        {
          groups.map(g =>
            <IonSelectOption key={g.id} value={g.id}>{g.name}</IonSelectOption>
          )
        }
        </IonSelect>
      </IonItem>
      {
        groupId &&
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
              <p>No workouts for today</p>
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
