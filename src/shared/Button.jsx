import './Button.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const Button = ({ children, onClick, variant = 'primary' }) => {
  const cxBtn = classNames('btn', variant);

  return (
    <button className={cxBtn} onClick={onClick}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

Button.defaultProps = {
  variant: 'primary',
};
