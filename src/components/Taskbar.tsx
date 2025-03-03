import React, { useState, useEffect, useRef } from "react";
import "../styles/taskbar.css";
import startIcon from "../assets/icons/start.png";
import profilePlaceholder from "../assets/icons/profile_image.jpeg"; // Replace with actual profile image

const Taskbar: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>("");
  const menuRef = useRef<HTMLDivElement | null>(null);
  const startButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // Handle clicks outside to close the Start Menu properly
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) && // Click is outside menu
        startButtonRef.current &&
        !startButtonRef.current.contains(event.target as Node) // Click is not on Start Button
      ) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("pointerdown", handleClickOutside); // Use pointerdown for reliability
    } else {
      document.removeEventListener("pointerdown", handleClickOutside);
    }

    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showMenu]); // Depend on showMenu state

  return (
    <div className="taskbar">
      {/* Start Button */}
      <button
        ref={startButtonRef}
        className="start-button"
        onClick={() => setShowMenu((prev) => !prev)} // Toggle menu on click
      >
        <img src={startIcon} alt="Start" className="start-icon" />
      </button>

      {/* Start Menu */}
      {showMenu && (
        <div ref={menuRef} className="start-menu">
          {/* Profile Section */}
          <div className="profile-section">
            <img src={profilePlaceholder} alt="Profile" className="profile-img" />
            <span className="profile-name">Bradley Nguyen</span>
          </div>

          {/* Menu Items */}
          <ul className="start-menu-items">
            <li>📝 Resume</li>
            <li>📂 My Projects</li>
            <li>📧 My Contact</li>
            <li className="logoff">🚪 Log Off</li>
          </ul>
        </div>
      )}

      {/* Open Applications Section */}
      <div className="open-apps">
        <span className="no-open-apps">No Open Windows</span>
      </div>

      {/* System Tray */}
      <div className="system-tray">
        <span className="time-display">{currentTime}</span>
      </div>
    </div>
  );
};

export default Taskbar;
