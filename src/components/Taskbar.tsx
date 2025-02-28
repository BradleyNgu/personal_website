import React, { useState, useEffect, useRef } from "react";
import "../styles/taskbar.css";
import startIcon from "../assets/icons/start.png"; // Ensure correct path

interface TaskbarProps {
  openWindows: string[];
  closeWindow: (window: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, closeWindow }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Live Clock Update
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close Start Menu When Clicking Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="taskbar">
      {/* Start Button */}
      <button className="start-button" onClick={() => setShowMenu(!showMenu)}>
        <img src={startIcon} alt="Start" className="start-icon" />
      </button>

      {/* Start Menu */}
      {showMenu && (
        <div ref={menuRef} className="start-menu">
          <ul>
            <li>📂 My Projects</li>
            <li>📝 Resume</li>
            <li>🌐 Browser</li>
            <li>🔧 Settings</li>
            <li className="logout">🚪 Logout</li>
          </ul>
        </div>
      )}

      {/* Open Applications Section */}
      <div className="open-apps">
        {openWindows.length > 0 ? (
          openWindows.map((app) => (
            <button key={app} className="taskbar-app" onClick={() => closeWindow(app)}>
              <span className="app-icon">🖥️</span> {app} <span className="close-btn">✖</span>
            </button>
          ))
        ) : (
          <span className="no-open-apps">No Open Windows</span>
        )}
      </div>

      {/* System Tray */}
      <div className="system-tray">
        <span>{currentTime}</span>
      </div>
    </div>
  );
};

export default Taskbar;
