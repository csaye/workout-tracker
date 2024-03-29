// general imports
import React, { useState } from 'react';
import { IonItem, IonLabel, IonCheckbox } from '@ionic/react';

// components
import Exercise from '../Exercise/Exercise';

// firebase
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// style
import './Workout.css';

// Workout component
function Workout(props) {
  // get workout information from props
  const { title, date, studentsComplete, id } = props.data;

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', id)
  .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  const studentName = firebase.auth().currentUser.displayName;
  const [complete, setComplete] = useState(studentsComplete.includes(studentName));

  // updates whether workout is complete for student
  async function updateComplete(e) {
    const isComplete = e.target.checked;
    setComplete(isComplete);
    // if workout complete, add name to workout
    if (isComplete) {
      await firebase.firestore().collection('workouts').doc(id).update({
        studentsComplete: firebase.firestore.FieldValue.arrayUnion(studentName)
      });
    // if workout not complete, remove name from workout
    } else {
      await firebase.firestore().collection('workouts').doc(id).update({
        studentsComplete: firebase.firestore.FieldValue.arrayRemove(studentName)
      })
    }
  }

  // if exercises loading, return loading page
  if (!exercises) {
    return (
      <div className="Workout">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="Workout">
      <h1><u>{title}</u></h1>
      {
        // map exercises to exercise components
        exercises.map(e => <Exercise key={e.id} data={e} />)
      }
      {/* completed checkbox */}
      <IonItem className="ion-item">
        <IonLabel>Completed</IonLabel>
        <IonCheckbox checked={complete} onIonChange={updateComplete} />
      </IonItem>
    </div>
  );
}

export default Workout;
