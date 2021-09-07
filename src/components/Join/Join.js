import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../Header/Header';

import './Join.scss';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');

  return (
    <>
      <Header />
      <div className="join-outer-container">
        <div className="join-inner-container">
          <h1 className="heading">Join</h1>
          <div>
            <input
              placeholder="Name"
              className="join-input"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="Room"
              className="join-input mt-20"
              type="text"
              onChange={(e) => setRoom(e.target.value)}
            />
          </div>
          <Link
            onClick={(e) => (!name || !room ? e.preventDefault() : null)}
            to={`/chat?name=${name}&room=${room}`}
          >
            <button className="button mt-20" type="submit">
              Join Room
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Join;
