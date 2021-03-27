// general imports
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';
import { currentDate } from '../../util/currentDate';

// components
import AdminExercise from '../../components/AdminExercise/AdminExercise';

// firebase
import { useCollectionData } from 'react-firebase-hooks/firestore';
import firebase from 'firebase/app';

// style
import './AdminHome.css';

// AdminHome component
function AdminHome() {
  const [groupId, setGroupId] = useState('');

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(currentDate);

  const [workout, setWorkout] = useState('');

  const [name, setName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [comments, setComments] = useState('');

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  // get today's workouts from firebase
  const todayWorkoutsQuery = firebase.firestore().collection('workouts')
  .where('date', '==', currentDate ? currentDate : 'null')
  .where('groupId', '==', groupId ? groupId : 'null')
  .orderBy('title');
  const [todayWorkouts] = useCollectionData(todayWorkoutsQuery, {idField: 'id'});

  // get other workouts from firebase
  const workoutsQuery = firebase.firestore().collection('workouts')
  .where('groupId', '==', groupId ? groupId : 'null')
  .orderBy('title');
  const [workouts] = useCollectionData(workoutsQuery, {idField: 'id'});

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', workout ? workout.id : 'null')
  .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  // creates a workout with current parameters
  async function createWorkout(e) {
    e.preventDefault();
    // if no group chosen, return
    if (!groupId) return;
    // add workout to firebase
    await firebase.firestore().collection('workouts').add({
      title,
      groupId,
      date,
      dateCreated: new Date(),
      studentsComplete: []
    // set current workout to this workout
    }).then(async docRef => {
      const id = docRef.id;
      const doc = await docRef.get();
      const docData = doc.data();
      setWorkout({id, ...docData});
    });
    // clear input fields
    setTitle('');
    setDate(currentDate);
  }

  // creates an exercise with current parameters
  async function createExercise(e) {
    e.preventDefault();
    // add exercise to firebase
    await firebase.firestore().collection('exercises').add({
      name,
      sets,
      reps,
      comments,
      workoutId: workout.id,
      createdAt: new Date()
    });
    // clear input fields
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

  // if no groups, return loading page
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
        !workout &&
        <div>
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
        </div>
      }
      {
        groupId &&
        <div>
          {
            // if current workout set, return editing page
            workout ?
            <>
              <h1 className="edit-workout">Editing "{workout.title}"</h1>
              {/* create exercise form */}
              <form onSubmit={createExercise} className="input-section">
                {/* name input */}
                <h4 className="input-title">Exercise Name</h4>
                <IonInput
                value={name}
                onIonChange={e => setName(e.target.value)}
                className="input-item"
                placeholder="exercise name"
                required
                />
                {/* sets input */}
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
                {/* reps input */}
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
                {/* comments input */}
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
                // map exercises to AdminExercise components
                exercises ?
                exercises.map(e => <AdminExercise key={e.id} data={e} />) :
                // show loading if no exercises yet
                <p>Loading exercises...</p>
              }
              {
                // if workout
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
            // if current workout not set, return create workout page
            <>
              <div className="input-section">
                <h1 className="create-workout">Create a Workout</h1>
                {/* create workout form */}
                <form onSubmit={createWorkout}>
                  {/* title input */}
                  <h4 className="input-title">Workout Title</h4>
                  <IonInput
                  value={title}
                  onIonChange={e => setTitle(e.target.value)}
                  placeholder="title"
                  className="input-item"
                  required
                  />
                  {/* date input */}
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
                // if workouts exist
                todayWorkouts?.length > 0 &&
                <div className="input-section top-margin">
                  <h1 className="edit-workout">Today's Workouts</h1>
                  {
                    // map workouts to edit workout buttons
                    todayWorkouts.map(w =>
                      <IonButton className="hover-scale edit-button" color="secondary" key={w.id} onClick={() => setWorkout(w)}>
                        {w.title}
                      </IonButton>
                    )
                  }
                </div>
              }
              {
                // if workouts exist
                workouts?.length > 0 &&
                <div className="input-section top-margin">
                  <h1 className="edit-workout">All Workouts</h1>
                  {
                    // map workouts to edit workout buttons
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
      }
    </div>
  );
}

export default AdminHome;
