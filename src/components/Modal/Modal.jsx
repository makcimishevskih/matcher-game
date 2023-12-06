import './Modal.css';

import { PropTypes } from 'prop-types';

import Button from '../../shared/Button';

const Modal = ({ result, handleClose }) => {
  return (
    <div
      className="win-layout"
      onClick={(e) => {
        if (e.target.classList.contains('win-layout')) {
          handleClose();
        }
      }}
    >
      <div className="win-modal">
        <div className="win-block">
          <Button className="win-close" onClick={() => handleClose()}>
            &#10006;
          </Button>
          <h2>you win!</h2>
          <p>Your score is: {result < 0 ? 0 : result}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;

Modal.propTypes = {
  // isOpen: PropTypes.bool,
  result: PropTypes.number,
  handleClose: PropTypes.func,
};
