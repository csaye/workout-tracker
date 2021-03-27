// general imports
import React, { useState } from 'react';
import { IonButton } from '@ionic/react';
import firebase from 'firebase/app';

// style
import './Exercise.css';

// Exercise component
function Exercise(props) {
  const [studentComments, setStudentComments] = useState('');

  // get exercise data from props
  const { id, name, sets, reps, comments } = props.data;

  const studentUid = firebase.auth().currentUser.uid;
  const studentName = firebase.auth().currentUser.displayName;

  // saves comments for current exercise
  function saveComments(e) {
    e.preventDefault();
    // update firestore with comments
    firebase.firestore().collection('exercises').doc(id).collection('comments').doc(studentUid).set({
      name: studentName,
      comments: studentComments
    });
  }

  return (
    <div className="Exercise soft-shadow">
      <h2>{name}</h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
      </div>
      <p><i>{comments}</i></p>
      <form onSubmit={saveComments}>
        <input placeholder="How did it feel?" value={studentComments} onChange={e => setStudentComments(e.target.value)} required />
        <IonButton type="submit">Save Comment</IonButton>
      </form>
    </div>
  );
}

export default Exercise;
