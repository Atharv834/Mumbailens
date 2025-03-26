import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! I\'m  Mumbai Lens Discover the world\'s amazing monuments through AI-powered insights.', sender: 'bot', icon: true },
  ]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsSidebarOpen(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchLocationDetails = async (latitude, longitude) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      return {
        city: data.address.city || data.address.town || data.address.village || 'Unknown Location',
        country: data.address.country || 'Unknown Country',
        nearbyMonuments: await fetchNearbyMonuments(latitude, longitude),
      };
    } catch (error) {
      console.error('Error fetching location details:', error);
      return { city: 'Unknown Location', country: 'Unknown Country', nearbyMonuments: [] };
    }
  };

  const fetchNearbyMonuments = async (latitude, longitude) => {
    const monuments = ['Local Historic Site', 'Nearby Memorial', 'Regional Landmark'];
    return monuments;
  };

  const handleOptionClick = (option) => {
    setMessages((prev) => [...prev, { text: option, sender: 'user' }]);
    if (option === 'Upload a monument image' || option === 'Identify this monument') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Please upload the image of the monument.', sender: 'bot', icon: true }]);
        fileInputRef.current.click();
      }, 1000);
    } else if (option === 'Learn about a monument') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Please tell me the name of the monument you want to learn about.', sender: 'bot', icon: true }]);
      }, 1000);
    } else if (option === 'Monument history') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Please specify the monument you want to learn the history of.', sender: 'bot', icon: true }]);
      }, 1000);
    } else if (option === 'Famous monuments') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Here are some famous monuments: Eiffel Tower, Taj Mahal, Statue of Liberty. Which one would you like to learn about?', sender: 'bot', icon: true }]);
      }, 1000);
    } else if (option === 'Feedback') {
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: 'Thank you for your interest! Please share your feedback about Mumbai Lens.', sender: 'bot', icon: true }]);
      }, 1000);
    } else if (option === 'Put your current location to get more accurate info') {
      setMessages((prev) => [...prev, { text: 'Requesting your location...', sender: 'bot', icon: true }]);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationDetails = await fetchLocationDetails(latitude, longitude);
            setMessages((prev) => [
              ...prev,
              { text: `Location detected: ${locationDetails.city}, ${locationDetails.country}. Nearby: ${locationDetails.nearbyMonuments.join(', ')}`, sender: 'bot', icon: true },
            ]);
          },
          (error) => {
            const errorMessage = error.code === 1 ? 'Location permission denied.' : 'Unable to get location.';
            setMessages((prev) => [...prev, { text: errorMessage, sender: 'bot', icon: true }]);
          }
        );
      } else {
        setMessages((prev) => [...prev, { text: 'Your browser does not support location sharing.', sender: 'bot', icon: true }]);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => setMessages((prev) => [...prev, { text: `Uploading: ${file.name}`, sender: 'user' }]);
      reader.onload = (e) => {
        setMessages((prev) => [
          ...prev,
          { text: 'Analyzing monument using AI...', sender: 'bot', icon: true },
          { text: 'Uploaded Image Preview', sender: 'user', image: e.target.result },
          { text: 'This looks like the Eiffel Tower in Paris! Height: 324m, Built in 1889. Would you like to know more?', sender: 'bot', icon: true },
        ]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNewChat = () => {
    setMessages([{ text: 'Hello! I\'m Mumbai Lens. Discover the world\'s amazing monuments through AI-powered insights.', sender: 'bot', icon: true }]);
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const options = [
    'Upload a monument image',
    'Identify this monument',
    'Learn about a monument',
    'Monument history',
    'Famous monuments',
    'Feedback',
    'Put your current location to get more accurate info',
  ];

  return (
    <div className="app-container">
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <h2> Mumbai Lens</h2>
          <button className="close-sidebar-btn" onClick={closeSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Chat
        </button>
      </div>

      <div className="chat-area">
        <div className="chat-header">
          <button className="menu-btn" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <img src="src\logo.png" alt="Monument GPT Logo" className="header-logo" />
          <h3> Mumbai Lens</h3>
        </div>

        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              {message.icon && message.sender === 'bot' && (
                <div className="message-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                </div>
              )}
              {message.image ? (
                <div className="message-image">
                  <img src={message.image} alt="Uploaded" />
                </div>
              ) : (
                <div className="message-content">{message.text}</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />

        <div className="options-container">
          <div className="options-grid">
            {options.map((option, index) => (
              <button
                key={index}
                className={`option-btn ${option === 'Put your current location to get more accurate info' ? 'location-btn' : ['Upload a monument image', 'Identify this monument'].includes(option) ? 'blue-btn' : ['Learn about a monument', 'Monument history', 'Famous monuments'].includes(option) ? 'green-btn' : ''}`}
                onClick={() => handleOptionClick(option)}
              >
                {option === 'Put your current location to get more accurate info' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
                      <circle cx="12" cy="9" r="2"></circle>
                    </svg>
                    {option}
                  </>
                ) : option === 'Upload a monument image' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="17 8 12 3 7 8"></polyline>
                      <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    {option}
                  </>
                ) : option === 'Learn about a monument' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                    </svg>
                    {option}
                  </>
                ) : (
                  option
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="footer-disclaimer">
        </div>
      </div>
    </div>
  );
};

export default App;