import React, { useRef, useEffect } from 'react';

import './OtherVideo.scss';

const OtherVideo = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      ref.current.srcObject = stream;
    });
  }, [props.peer]);

  return (
    <>
      <video className="other-video" playsInline autoPlay ref={ref} />
    </>
  );
};

export default OtherVideo;
