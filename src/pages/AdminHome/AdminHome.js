import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

import './AdminHome.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

import AdminExercise from '../../components/AdminExercise/AdminExercise';

import { currentDate } from '../../util/currentDate';

function AdminHome() {
  const [title, setTitle] = useState('');
  const [lastTitle, setLastTitle] = useState('');
  const [groupId, setGroupId] = useState('');
  const [date, setDate] = useState('');

  const [workoutId, setWorkoutId] = useState('');

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
  .where('workoutId', '==', workoutId ? workoutId : 'null')
  .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  async function createWorkout(e) {
    e.preventDefault();
    setLastTitle(title);
    await firebase.firestore().collection('workouts').add({
      title,
      groupId,
      date,
      dateCreated: new Date()
    }).then(docRef => {
      setWorkoutId(docRef.id);
    });
    setTitle('');
    setGroupId('');
    setDate('');
  }

  async function createExercise(e) {
    e.preventDefault();
    await firebase.firestore().collection('exercises').add({
      name,
      sets,
      reps,
      comments,
      workoutId,
      createdAt: new Date()
    });
    setName('');
    setSets(0);
    setReps(0);
    setComments('');
  }

  // deletes current workout
  async function deleteWorkout() {
    const wId = workoutId;
    setWorkoutId('');
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
        workoutId ?
        <>
          <h1>Editing "{lastTitle}"</h1>
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
            <IonButton type="submit">Create Exercise</IonButton>
          </form>
          {
            exercises ?
            exercises.map(e => <AdminExercise key={e.id} data={e} />) :
            <p>Loading...</p>
          }
          <IonButton color="danger" onClick={deleteWorkout}>Delete Workout</IonButton>
          <IonButton onClick={() => setWorkoutId('')}>Finish</IonButton>
        </> :
        <>
          <form onSubmit={createWorkout}>
            <div className="input-section">
              <h1 className="input-title">Workout Title</h1>
              <IonInput
              value={title}
              onIonChange={e => setTitle(e.target.value)}
              placeholder="title"
              className="input-item"
              required
              />
            </div>
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
            <div className="input-section">
              <h1 className="input-title">Workout Date</h1>
              <IonInput
              value={date}
              onIonChange={e => setDate(e.target.value)}
              type="date"
              className="input-item"
              required
              />
            </div>
            <IonButton type="submit" className="submit-button">Create Workout</IonButton>
          </form>
          { workouts?.length > 0 && <h1 className="edit-workout">Edit Workout</h1> }
          {
            workouts ?
            workouts.map(w =>
              <IonButton color="secondary" key={w.id} onClick={() => {
                setLastTitle(w.title);
                setWorkoutId(w.id);
              }}>
                {w.title}
              </IonButton>
            ) :
            <p>Loading...</p>
          }
        </>
      }
    </div>
  );
}

export default AdminHome;
