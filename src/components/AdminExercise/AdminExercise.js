// general imports
import { IonButton } from '@ionic/react';

// firebase
import firebase from 'firebase/app';

// style
import './AdminExercise.css';

// AdminExercise component
function AdminExercise(props) {
  // get exercise data from props
  const { name, sets, reps, comments, id } = props.data;

  // deletes current exercise
  async function deleteExercise() {
    await firebase.firestore().collection('exercises').doc(id).delete();
  }

  return (
    <div className="AdminExercise soft-shadow">
      <h2>{name}</h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
      </div>
      <p className="comments"><i>{comments}</i></p>
      <IonButton className="hover-scale" color="danger" onClick={deleteExercise}>Delete</IonButton>
    </div>
  );
}

export default AdminExercise;
