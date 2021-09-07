import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './RoomInfo.scss';

const RoomInfo = ({ setIsUsers, users }) => {
  return (
    <div className="roomInfo-container">
      <div className="roomInfo">
        <div className="left-inner-container">
          <h3>Active Users</h3>
        </div>
        <div
          className="right-inner-container"
          onClick={() => {
            setIsUsers(false);
          }}
        >
          <img className="close" src={closeIcon} alt="close" />
        </div>
      </div>
      {users ? (
        <div>
          <div className="active-container">
            <h2>
              {users.map(({ name }) => (
                <div key={name} className="active-item">
                  {name}
                  <img
                    className="online-icon"
                    alt="Online Icon"
                    src={onlineIcon}
                  />
                </div>
              ))}
            </h2>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RoomInfo;
