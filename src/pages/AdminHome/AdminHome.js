import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel } from '@ionic/react';

import './AdminHome.css';

import firebase from 'firebase/app';

function AdminHome() {
  function createWorkout() {

  }

  return (
    <div className="AdminHome center-box">
      <form onSubmit={createWorkout}>
        <div className="input-section">
          <h1 className="input-title">Workout Title</h1>
          <IonInput
          className="input-item"
          required
          />
        </div>
        <div className="margin-sm"></div>
        <div className="input-section">
          <h1 className="input-title">Workout Date</h1>
          <IonInput
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
