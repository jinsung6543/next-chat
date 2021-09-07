import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

import './MyVideo.scss';

const videoHeight = 480;
const videoWidth = 640;

const MyVideo = ({ name, videoRef }) => {
  const [initializing, setInitializing] = useState(false);
  const canvasRef = useRef();
  let predictedAges = [];

  useEffect(() => {
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
  }, []);

  const handleVideoOnPlay = () => {
    setInterval(async () => {
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
              videoRef.current.clientHeight,
              videoRef.current.clientWidth
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
        className="my-video"
        muted
        ref={videoRef}
        autoPlay
        onPlay={handleVideoOnPlay}
        playsInline
      />
      <canvas ref={canvasRef} className="position-absolute" />
    </div>
  );
};

export default MyVideo;
