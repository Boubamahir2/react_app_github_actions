
import { Link } from 'react-router-dom';

function Card({ appart }) {

  return (
    <Link className='card' to={`/lodging/${appart.id}`}>
      <div className='cardImg'>
        <img src={appart.cover} alt={appart.title} />
      </div>
      <h4>{appart.title}</h4>
    </Link>
  );
}

export default Card;
