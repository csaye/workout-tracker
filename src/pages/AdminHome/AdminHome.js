import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonSelect, IonSelectOption } from '@ionic/react';

import './AdminHome.css';
import { useCollectionData } from 'react-firebase-hooks/firestore';

import firebase from 'firebase/app';

function AdminHome() {
  const [title, setTitle] = useState('');
  const [group, setGroup] = useState('');
  const [date, setDate] = useState('');

  // get groups from firebase
  const groupsQuery = firebase.firestore().collection('groups').orderBy('name');
  const [groups] = useCollectionData(groupsQuery);

  async function createWorkout(e) {
    e.preventDefault();
    await firebase.firestore().collection('workouts').add({
      title,
      group,
      date,
      dateCreated: new Date()
    });
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
      <form onSubmit={createWorkout}>
        <div className="input-section">
          <h1 className="input-title">Workout Title</h1>
          <IonInput
          value={title}
          onIonChange={e => setTitle(e.target.value)}
          className="input-item"
          required
          />
        </div>
        <IonItem>
          <IonLabel>Select Group</IonLabel>
          <IonSelect value={group} onIonChange={e => setGroup(e.target.value)} required>
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
    </div>
  );
}

export default AdminHome;
