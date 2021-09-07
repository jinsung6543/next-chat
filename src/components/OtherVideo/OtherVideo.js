import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';

import './OtherVideo.scss';

const videoHeight = 480;
const videoWidth = 640;
let interval = null;

const OtherVideo = (props) => {
  const videoRef = useRef();
  const [initializing, setInitializing] = useState(false);
  const canvasRef = useRef();
  let predictedAges = [];

  useEffect(() => {
    props.peer.on('stream', (stream) => {
      videoRef.current.srcObject = stream;
    });
    const loadModels = async () => {
      const MODEL_URL = process.env.PUBLIC_URL + '/models';
      setInitializing(true);
      Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
      ]).then();
    };
    loadModels();

    return () => {
      clearInterval(interval);
    };
  }, [props.peer]);

  const handleVideoOnPlay = () => {
    interval = setInterval(async () => {
      if (initializing) {
        setInitializing(false);
      }
      if (
        videoRef &&
        videoRef.current &&
        videoRef.current.srcObject &&
        canvasRef &&
        canvasRef.current
      ) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoRef.current.clientWidth,
          height: videoRef.current.clientHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detections = await faceapi
          .detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withAgeAndGender();
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        if (canvasRef.current) {
          canvasRef.current
            .getContext('2d')
            .clearRect(
              0,
              0,
              videoRef.current.clientWidth,
              videoRef.current.clientHeight
            );
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceExpressions(
            canvasRef.current,
            resizedDetections
          );

          if (resizedDetections[0] && resizedDetections[0].age) {
            const age = resizedDetections[0].age;
            const bottomRight = {
              x: resizedDetections[0].detection.box.bottomRight.x - 60,
              y: resizedDetections[0].detection.box.bottomRight.y,
            };
            const interpolatedAge = interpolateAgePredictions(age);
            new faceapi.draw.DrawTextField(
              [`${faceapi.utils.round(interpolatedAge, 0)} years`],
              bottomRight
            ).draw(canvasRef.current);
          }
        }
      }
    }, 300);
  };

  const interpolateAgePredictions = (age) => {
    predictedAges = [age].concat(predictedAges).slice(0, 30);
    const avgPredictedAge =
      predictedAges.reduce((total, a) => total + a) / predictedAges.length;
    return avgPredictedAge;
  };

  return (
    <div className="display-flex">
      <video
        className="other-video"
        playsInline
        autoPlay
        onPlay={handleVideoOnPlay}
        ref={videoRef}
      />
      <canvas ref={canvasRef} className="position-absolute" />
    </div>
  );
};

export default OtherVideo;
