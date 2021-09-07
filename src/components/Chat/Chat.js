import React, { useState, useEffect, useRef } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import Peer from 'simple-peer';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import Header from '../Header/Header';
import ChatPageHeader from '../ChatPageHeader/ChatPageHeader';
import RoomInfo from '../RoomInfo/RoomInfo';
import MyVideo from '../MyVideo/MyVideo';
import OtherVideo from '../OtherVideo/OtherVideo';

import './Chat.scss';

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMessenger, setIsMessenger] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [messageAlert, setMessageAlert] = useState({});
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const userVideo = useRef();
  const peersRef = useRef([]);
  const ENDPOINT = 'http://localhost:5000';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socketRef.current = io(ENDPOINT);

    setName(name);
    setRoom(room);

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join', { name, room }, () => {});
        socketRef.current.on('roomData', ({ users }) => {
          setUsers(users);
        });

        socketRef.current.on('connectToOthers', ({ otherUsers }) => {
          const peers = [];
          otherUsers.forEach((user) => {
            const peer = createPeer(user.id, socketRef.current.id, stream);
            peersRef.current.push({
              peerID: user.id,
              peer,
            });
            peers.push({
              peerID: user.id,
              peer,
            });
          });
          setPeers(peers);
        });

        socketRef.current.on('userJoined', (payload) => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          });

          setPeers([...peersRef.current]);
        });

        socketRef.current.on('receivedSignal', (payload) => {
          const item = peersRef.current.find((p) => p.peerID === payload.id);
          item.peer.signal(payload.signal);
        });

        socketRef.current.on('userLeft', (id) => {
          const peerObj = peersRef.current.find((p) => p.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy();
          }
          const peers = peersRef.current.filter((p) => p.peerID !== id);
          peersRef.current = peers;
          setPeers(peers);
        });
      });

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off();
    };
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socketRef.current.on('message', (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socketRef.current.emit('sendMessage', message, () => setMessage(''));
    }
  };

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('sendSignal', {
        userToSignal,
        callerID,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (signal) => {
      socketRef.current.emit('returnSignal', { signal, callerID });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <>
      <Header />
      <div className="outer-container">
        <ChatPageHeader
          isMessenger={isMessenger}
          setIsMessenger={setIsMessenger}
          isUsers={isUsers}
          setIsUsers={setIsUsers}
          messageAlert={messageAlert}
          setMessageAlert={setMessageAlert}
        />

        <div className="video-container">
          <MyVideo videoRef={userVideo} />
          {peers.map((peer) => {
            return <OtherVideo key={peer.peerID} peer={peer.peer} />;
          })}
        </div>
        {isMessenger && (
          <div className="container">
            <InfoBar room={room} setIsMessenger={setIsMessenger} />
            <Messages messages={messages} name={name} />
            <Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          </div>
        )}
        {isUsers && (
          <RoomInfo setIsUsers={setIsUsers} users={users} />

          // <TextContainer users={users} />
        )}
      </div>
    </>
  );
};

export default Chat;
