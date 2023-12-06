import './Button.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Button = ({ children, onClick, variant = 'primary' }) => {
  const cxBtn = classNames('btn', variant);

  return (
    <button className={cxBtn} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

Button.defaultProps = {
  variant: 'primary',
};
