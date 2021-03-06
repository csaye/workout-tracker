import './Workout.css';

function Workout(props) {
  const { title, date } = props.data;

  return (
    <div className="Workout">
      <p>{title}</p>
      <p>{date}</p>
    </div>
  );
}

export default Workout;
