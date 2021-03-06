import './Exercise.css';

function Exercise(props) {
  const { name, sets, reps, comments } = props.data;

  return (
    <div className="Exercise">
      <h2>{name}</h2>
      <div className="workout-info">
        <p>Sets: {sets}</p>
        <p>Reps: {reps}</p>
      </div>
      <p><i>{comments}</i></p>
    </div>
  );
}

export default Exercise
