import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const socket = io('https://vercel-backend-2-ixtg.onrender.com/');

function App(){
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chat history', (msgs) => setMessages(msgs));
    socket.on('receive message', (msg) => setMessages((prev) => [...prev, msg]));
    return () => {
      socket.off('chat history');
      socket.off('receive message');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const msg = { user: username, text: input, time: new Date().toLocaleTimeString() };
      socket.emit('send message', msg);
      setInput('');
    }
  };
  // Get unique users from messages
  const users = Array.from(new Set(messages.map(m => m.user)));

  if(!joined){
    return (
      <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', justifyContent: 'center', background: '#f0f2f5' }}>
        <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ marginBottom: 20, color: '#075e54' }}>Join Chat</h2>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Enter your username"
            style={{ padding: 10, borderRadius: 6, border: '1px solid #ccc', width: 220, marginBottom: 16 }}
          />
          <br />
          <button 
            onClick={() => username && setJoined(true)}
            style={{ padding: '10px 24px', borderRadius: 6, background: '#25d366', color: '#fff', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
          >Join</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', background: '#ece5dd', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: 700, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', height: 600 }}>
        {/* Sidebar */}
        <div style={{ width: 180, background: '#f7f7f7', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '18px 16px', borderTopLeftRadius: 12, fontWeight: 'bold', fontSize: 17, color: '#075e54', borderBottom: '1px solid #eee', background: '#e0f2f1' }}>Users</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
            {users.map((user, idx) => (
              <div key={idx} style={{
                padding: '10px 18px',
                background: user === username ? '#dcf8c6' : 'transparent',
                color: user === username ? '#075e54' : '#333',
                borderRadius: 8,
                margin: '4px 8px',
                fontWeight: user === username ? 'bold' : 'normal',
                fontSize: 15
              }}>
                {user}
              </div>
            ))}
          </div>
        </div>
        {/* Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ background: '#075e54', color: '#fff', padding: '18px 20px', borderTopRightRadius: 12, fontWeight: 'bold', fontSize: 20, letterSpacing: 1 }}>Chat Room</div>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#ece5dd', display: 'flex', flexDirection: 'column' }}>
            {messages.map((msg, idx) => {
              const isOwn = msg.user === username;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isOwn ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    background: isOwn ? '#dcf8c6' : '#fff',
                    color: '#222',
                    borderRadius: 16,
                    borderBottomRightRadius: isOwn ? 4 : 16,
                    borderBottomLeftRadius: isOwn ? 16 : 4,
                    padding: '10px 16px',
                    maxWidth: '75%',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    fontSize: 15,
                    wordBreak: 'break-word',
                    position: 'relative'
                  }}>
                    <span style={{ fontWeight: 'bold', fontSize: 13, color: isOwn ? '#34b7f1' : '#075e54' }}>{msg.user}</span>
                    <span style={{ marginLeft: 8, fontSize: 11, color: '#888', float: 'right' }}>{msg.time}</span>
                    <div style={{ marginTop: 2 }}>{msg.text}</div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} style={{ display: 'flex', padding: 16, borderTop: '1px solid #eee', background: '#f7f7f7', borderBottomRightRadius: 12 }}>
            <input
              style={{ flex: 1, padding: 12, borderRadius: 20, border: '1px solid #ccc', outline: 'none', fontSize: 15, marginRight: 10, background: '#fff' }}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
            />
            <button type="submit" style={{ padding: '10px 20px', borderRadius: 20, background: '#25d366', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: 15, cursor: 'pointer' }}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default App;
