import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

import './AdminHome.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import AdminExercise from '../../components/AdminExercise/AdminExercise';

import { currentDate } from '../../util/currentDate';

function AdminHome() {
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState(currentDate);

  const [workout, setWorkout] = useState('');

  const [name, setName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [comments, setComments] = useState('');

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  // get workouts from firebase
  const workoutsQuery = firebase.firestore().collection('workouts')
  .where('date', '==', currentDate ? currentDate : 'null');
  const [workouts] = useCollectionData(workoutsQuery, {idField: 'id'});

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', workout ? workout.id : 'null')
  .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  async function createWorkout(e) {
    e.preventDefault();
    if (!groupId) return;
    await firebase.firestore().collection('workouts').add({
      title,
      groupId,
      date,
      dateCreated: new Date(),
      studentsComplete: []
    }).then(async docRef => {
      const id = docRef.id;
      const doc = await docRef.get();
      const docData = doc.data();
      setWorkout({id, ...docData});
    });
    setTitle('');
    setGroupId('');
    setDate(currentDate);
  }

  async function createExercise(e) {
    e.preventDefault();
    await firebase.firestore().collection('exercises').add({
      name,
      sets,
      reps,
      comments,
      workoutId: workout.id,
      createdAt: new Date()
    });
    setName('');
    setSets(0);
    setReps(0);
    setComments('');
  }

  // deletes current workout
  async function deleteWorkout() {
    const wId = workout.id;
    setWorkout('');
    await firebase.firestore().collection('workouts').doc(wId).delete();
  }

  if (!groups) {
    return (
      <div className="AdminHome">
        <p className="margin-sm">Loading...</p>
      </div>
    )
  }

  return (
    <div className="AdminHome center-box">
      {
        workout ?
        <>
          <h1 className="edit-workout">Editing "{workout.title}"</h1>
          <form onSubmit={createExercise} className="input-section">
            <h4 className="input-title">Exercise Name</h4>
            <IonInput
            value={name}
            onIonChange={e => setName(e.target.value)}
            className="input-item"
            placeholder="exercise name"
            required
            />
            <h4 className="input-title">Sets</h4>
            <IonInput
            value={sets}
            type="number"
            onIonChange={e => setSets(e.target.value)}
            step="1"
            min="1"
            className="input-item"
            required
            />
            <h4 className="input-title">Reps</h4>
            <IonInput
            value={reps}
            type="number"
            onIonChange={e => setReps(e.target.value)}
            step="1"
            min="1"
            className="input-item"
            required
            />
            <h4 className="input-title">Comments</h4>
            <IonInput
            value={comments}
            onIonChange={e => setComments(e.target.value)}
            className="input-item"
            placeholder="comments"
            />
            <IonButton className="create-workout hover-scale" type="submit">Create Exercise</IonButton>
          </form>
          {
            exercises ?
            exercises.map(e => <AdminExercise key={e.id} data={e} />) :
            <p>Loading exercises...</p>
          }
          {
            workout ?
            <>
              {
                workout.studentsComplete?.length > 0 ?
                <p>Students complete: {workout.studentsComplete.join(', ')}</p> :
                <p>No students have completed the workout yet</p>
              }
            </> :
            <p>Loading students...</p>
          }
          <IonButton className="hover-scale right-margin" color="danger" onClick={deleteWorkout}>Delete Workout</IonButton>
          <IonButton className="hover-scale" onClick={() => setWorkout('')}>Finish</IonButton>
        </> :
        <>
          <div className="input-section">
            <h1 className="create-workout">Create a Workout</h1>
            <form onSubmit={createWorkout}>
              <IonItem className="group-select">
                <IonLabel>Select Group</IonLabel>
                <IonSelect value={groupId} onIonChange={e => setGroupId(e.target.value)} required>
                {
                  groups.map(g =>
                    <IonSelectOption key={g.id} value={g.id}>{g.name}</IonSelectOption>
                  )
                }
                </IonSelect>
              </IonItem>
              <h4 className="input-title">Workout Title</h4>
              <IonInput
              value={title}
              onIonChange={e => setTitle(e.target.value)}
              placeholder="title"
              className="input-item"
              required
              />
              <h4 className="input-title">Workout Date</h4>
              <IonInput
              value={date}
              onIonChange={e => setDate(e.target.value)}
              type="date"
              className="input-item"
              required
              />
              <IonButton className="hover-scale create-workout" type="submit">Create Workout</IonButton>
            </form>
          </div>
          {
            workouts?.length > 0 &&
            <div className="input-section top-margin">
              <h1 className="edit-workout">Edit Workout</h1>
              {
                workouts.map(w =>
                  <IonButton className="hover-scale edit-button" color="secondary" key={w.id} onClick={() => setWorkout(w)}>
                    {w.title}
                  </IonButton>
                )
              }
            </div>
          }
        </>
      }
    </div>
  );
}

export default AdminHome;
