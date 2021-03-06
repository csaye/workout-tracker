import './Workout.css';

function Workout(props) {
  const { title } = props.data;

  return (
    <div className="Workout">
      <p>{title}</p>
    </div>
  );
}

export default Workout;
