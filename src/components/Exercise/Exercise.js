// general imports
import React, { useState, useEffect } from 'react';
import { IonButton } from '@ionic/react';
import firebase from 'firebase/app';

// style
import './Exercise.css';

// Exercise component
function Exercise(props) {
  const [studentComments, setStudentComments] = useState('');
  const [successText, setSuccessText] = useState('');

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
    setSuccessText('Comment successfully saved');
    setTimeout(() => {
      setSuccessText('');
    }, 3000);
  }

  useEffect(() => {
    // get comments from firebase
    const snapshot = firebase.firestore().collection('exercises').doc(id).collection('comments').doc(studentUid).get()
    .then(doc => {
      if (doc.exists) {
        setStudentComments(doc.data().comments);
      }
    })
  }, []);

  return (
    <div className="Exercise">
      <h2><u>{name}</u></h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
        <p className="comments"><i>{comments}</i></p>
      </div>
      <form onSubmit={saveComments}>
        <input placeholder="How did it feel?" value={studentComments} onChange={e => setStudentComments(e.target.value)} required />
        <IonButton type="submit">Save Comment</IonButton>
        {successText && <p className="success">{successText}</p>}
      </form>
    </div>
  );
}

export default Exercise;
