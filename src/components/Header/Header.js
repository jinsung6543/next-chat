import React from 'react';
import { useHistory } from 'react-router-dom';

import './Header.scss';

const Header = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/');
    window.location.reload();
  };

  return (
    <div className="header">
      <div className="logo" onClick={handleClick}>
        <img src={process.env.PUBLIC_URL + '/images/logo.png'} alt="logo" />
      </div>
    </div>
  );
};

export default Header;
