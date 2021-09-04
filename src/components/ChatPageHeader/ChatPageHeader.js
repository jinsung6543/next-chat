import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserFriends,
  faCommentAlt,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { formatDate } from '../../utils/helpers';

import './ChatPageHeader.scss';

const ChatPageHeader = ({
  isMessenger,
  setIsMessenger,
  isUsers,
  setIsUsers,
  messageAlert,
  setMessageAlert,
}) => {
  let interval = null;
  const [currentTime, setCurrentTime] = useState(() => {
    return formatDate();
  });

  useEffect(() => {
    interval = setInterval(() => setCurrentTime(formatDate()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="frame-header">
      <div
        className="header-items icon-block"
        onClick={() => {
          setIsUsers(true);
        }}
      >
        <FontAwesomeIcon className="icon" icon={faUserFriends} />
      </div>
      <div
        className="header-items icon-block"
        onClick={() => {
          setIsMessenger(true);
          setMessageAlert({});
        }}
      >
        <FontAwesomeIcon className="icon" icon={faCommentAlt} />
        {!isMessenger && messageAlert.alert && (
          <span className="alert-circle-icon"></span>
        )}
      </div>
      <div className="header-items date-block">{currentTime}</div>
    </div>
  );
};

export default ChatPageHeader;
