import React from 'react';

import './MyVideo.scss';

const MyVideo = ({ name, videoRef }) => {
  return (
    <div>
      <video className="my-video" muted ref={videoRef} autoPlay playsInline />
    </div>
  );
};

export default MyVideo;
