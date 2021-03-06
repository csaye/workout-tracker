import './Workout.css';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function Workout(props) {
  const { title, date, id } = props.data;

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', id);
  // .orderBy('createdAt');
  const [exercises] = useCollectionData(exercisesQuery, {idField: 'id'});

  if (!exercises) {
    return (
      <div className="Workout">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="Workout">
      <p>{title}</p>
      {
        exercises.map(e =>
          <div key={e.id}>
            <p>{e.name}</p>
            <p>{e.sets}</p>
            <p>{e.reps}</p>
            <p>{e.comments}</p>
          </div>
        )
      }
    </div>
  );
}

export default Workout;
