// App.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Input from "./components/Input";

const socket = io("http://localhost:4000");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState('');
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on('message', (data) => {
      setMessages(m => [...m, data]);
    });

    socket.on('userList', (userList) => {
      setUsers(userList);
    });

    return () => {
      socket.off('message');
      socket.off('userList');
    };
  }, []);

  const joinChat = (nick) => {
    setNickname(nick);
    setJoined(true);
    socket.emit('join', nick);
  };

  const send = (message) => {
    socket.emit('message', { nickname, message });
  };

  return (
    <div>
      {!joined ? (
        <Input send={joinChat} buttonText='Join Chat' />
      ) : (
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div style={{ minWidth: '150px' }}>
            <h3>Active Users:</h3>
            <ul>
              {users.map((u) => <li key={u}>{u}</li>)}
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3>Chat:</h3>
            <ul>
              {messages.map((m, index) => <li key={index}>{m}</li>)}
            </ul>
            <Input send={send} buttonText='Send' />
          </div>
        </div>
      )}
    </div>
  );
}
