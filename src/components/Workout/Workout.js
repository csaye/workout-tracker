import './Workout.css';

import React, { useState } from 'react';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import Exercise from '../Exercise/Exercise';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function Workout(props) {
  const { title, date, studentsComplete, id } = props.data;

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', id)
  .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  // whether workout is complete for student
  const studentName = firebase.auth().currentUser.displayName;
  const [complete, setComplete] = useState(studentsComplete.includes(studentName));
  async function updateComplete(e) {
    const isComplete = e.target.checked;
    setComplete(isComplete);
    if (isComplete) {
      await firebase.firestore().collection('workouts').doc(id).update({
        studentsComplete: firebase.firestore.FieldValue.arrayUnion(studentName)
      });
    } else {
      await firebase.firestore().collection('workouts').doc(id).update({
        studentsComplete: firebase.firestore.FieldValue.arrayRemove(studentName)
      })
    }
  }

  if (!exercises) {
    return (
      <div className="Workout">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="Workout">
      <h1>{title}</h1>
      {
        exercises.map(e => <Exercise key={e.id} data={e} />)
      }
      <IonItem className="ion-item">
        <IonLabel>Completed</IonLabel>
        <IonCheckbox checked={complete} onIonChange={updateComplete} />
      </IonItem>
    </div>
  );
}

export default Workout;
