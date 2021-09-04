import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './RoomInfo.scss';

const RoomInfo = ({ setIsUsers, users }) => {
  return (
    <div className="roomInfo-container">
      <div className="roomInfo">
        <div className="leftInnerContainer">
          <h3>Online:</h3>
        </div>
        <div
          className="rightInnerContainer"
          onClick={() => {
            setIsUsers(false);
          }}
        >
          <img src={closeIcon} alt="close" />
        </div>
      </div>
      {users ? (
        // <div>
        // <div className="activeContainer">
        <h2>
          {users.map(({ name }) => (
            <div key={name}>
              {name}
              <img alt="Online Icon" src={onlineIcon} />
            </div>
          ))}
        </h2>
      ) : // </div>
      // </div>
      null}
    </div>
  );
};

export default RoomInfo;
