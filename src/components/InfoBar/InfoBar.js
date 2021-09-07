import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import './InfoBar.scss';

const InfoBar = ({ room, setIsMessenger }) => {
  return (
    <div className="infoBar">
      <div className="left-inner-container">
        <img src={onlineIcon} alt="online" className="online-icon" />
        <h3>{room}</h3>
      </div>
      <div
        className="right-inner-container"
        onClick={() => {
          setIsMessenger(false);
        }}
      >
        <img className="close" src={closeIcon} alt="close" />
      </div>
    </div>
  );
};

export default InfoBar;
