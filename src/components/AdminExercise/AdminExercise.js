// general imports
import { IonButton } from '@ionic/react';

// firebase
import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// style
import './AdminExercise.css';

// AdminExercise component
function AdminExercise(props) {
  // get exercise data from props
  const { name, sets, reps, comments, id } = props.data;

  const commentsQuery = firebase.firestore().collection('exercises').doc(id).collection('comments');
  const [studentComments] = useCollectionData(commentsQuery, {idField: 'id'})

  // deletes current exercise
  async function deleteExercise() {
    await firebase.firestore().collection('exercises').doc(id).delete();
  }

  return (
    <div className="AdminExercise soft-shadow">
      <h2><u>{name}</u></h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
        <p className="comments"><i>{comments}</i></p>
      </div>
      <div className="student-comments">
        <h3>Student Comments</h3>
        {
          studentComments &&
          studentComments.map(c => <div key={c.id}>{c.name} | <i>{c.comments}</i></div>)
        }
      </div>
      <IonButton className="hover-scale" color="danger" onClick={deleteExercise}>Delete</IonButton>
    </div>
  );
}

export default AdminExercise;
