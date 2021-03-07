// style
import './Exercise.css';

// Exercise component
function Exercise(props) {
  // get exercise data from props
  const { name, sets, reps, comments } = props.data;

  return (
    <div className="Exercise soft-shadow">
      <h2>{name}</h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
      </div>
      <p><i>{comments}</i></p>
    </div>
  );
}

export default Exercise;
