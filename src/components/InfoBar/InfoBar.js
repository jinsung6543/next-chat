import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';
import './InfoBar.css';

const InfoBar = ({ room, setIsMessenger }) => {
  return (
    <div className="infoBar">
      <div className="leftInnerContainer">
        <img src={onlineIcon} alt="online" className="onlineIcon" />
        <h3>{room}</h3>
      </div>
      <div
        className="rightInnerContainer"
        onClick={() => {
          setIsMessenger(false);
        }}
      >
        <img src={closeIcon} alt="close" />
      </div>
    </div>
  );
};

export default InfoBar;
