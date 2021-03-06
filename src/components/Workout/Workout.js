import './Workout.css';

import Exercise from '../Exercise/Exercise';

import firebase from 'firebase/app';
import { useCollectionData } from 'react-firebase-hooks/firestore';

function Workout(props) {
  const { title, date, id } = props.data;

  // get exercises from firebase
  const exercisesQuery = firebase.firestore().collection('exercises')
  .where('workoutId', '==', id)
  .orderBy('createdAt');
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
      <h1>{title}</h1>
      {
        exercises.map(e => <Exercise key={e.id} data={e} />)
      }
    </div>
  );
}

export default Workout;
