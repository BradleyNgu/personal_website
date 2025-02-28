import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Taskbar from "./Taskbar";
import "./../styles/desktop.css";

import folderIcon from "../assets/icons/folder.png";
import computerIcon from "../assets/icons/computer.png";
import recycleBinIcon from "../assets/icons/recycle-bin.png";
import browserIcon from "../assets/icons/browser.png";

interface WindowProps {
  name: string;
  onClose: () => void;
  bringToFront: () => void;
  isActive: boolean;
}

const DraggableWindow: React.FC<WindowProps> = ({ name, onClose, bringToFront, isActive }) => {
  const [position, setPosition] = useState({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Handle mouse press to begin dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    bringToFront(); // Move window to front when clicked
  };

  // Handle dragging movement
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  // Stop dragging when mouse is released
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      className="window"
      style={{
        left: position.x,
        top: position.y,
        zIndex: isActive ? 1000 : 1, // Ensures active window is on top
      }}
    >
      <div className="window-header" onMouseDown={handleMouseDown}>
        <span>{name}</span>
        <button onClick={onClose}>X</button>
      </div>
      <div className="window-content">Content of {name}</div>
    </div>
  );
};

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);

  // Open a new window or bring an existing one to the front
  const openWindow = (windowName: string) => {
    if (!openWindows.includes(windowName)) {
      setOpenWindows([...openWindows, windowName]);
    }
    setActiveWindow(windowName); // Set clicked window as active
  };

  // Close a window and update the active window
  const closeWindow = (windowName: string) => {
    setOpenWindows(openWindows.filter((w) => w !== windowName));
    setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
  };

  return (
    <div className="desktop">
      {/* Desktop Icons */}
      <Icon name="Projects" image={folderIcon} onClick={() => openWindow("Projects")} />
      <Icon name="Experiences" image={folderIcon} onClick={() => openWindow("Experiences")} />
      <Icon name="My Computer" image={computerIcon} onClick={() => openWindow("My Computer")} />
      <Icon name="Recycle Bin" image={recycleBinIcon} onClick={() => openWindow("Recycle Bin")} />
      <Icon name="Browser" image={browserIcon} onClick={() => openWindow("Browser")} />

      {/* Open Windows */}
      <div className="open-windows">
        {openWindows.map((window) => (
          <DraggableWindow
            key={window}
            name={window}
            onClose={() => closeWindow(window)}
            bringToFront={() => setActiveWindow(window)}
            isActive={activeWindow === window}
          />
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar openWindows={openWindows} closeWindow={closeWindow} />
    </div>
  );
};

export default Desktop;
