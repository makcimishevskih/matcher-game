import PropTypes from 'prop-types';
import classNames from 'classnames';

import './Card.css';
import cardTop from '../../assets/card-top.png';

const Card = ({ img, handlePick, isActive, isSuccess, isError }) => {
  const cxCard = classNames('card', {
    active: isActive,
  });

  return (
    <div className={cxCard} onClick={handlePick}>
      <div className="card__front">
        <img src={cardTop} alt="card-top" />
      </div>

      <div className="card__back">
        <div className={isSuccess ? 'success' : ''} />
        <div className={isError ? 'error' : ''} />
        <img src={img} alt="card-bottom" />
      </div>
    </div>
  );
};
export default Card;

Card.propTypes = {
  img: PropTypes.string,
  isError: PropTypes.bool,
  isActive: PropTypes.bool,
  isSuccess: PropTypes.bool,
  handlePick: PropTypes.func,
};
