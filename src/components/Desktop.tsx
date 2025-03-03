import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Taskbar from "./Taskbar";
import "./../styles/desktop.css";

import folderIcon from "../assets/icons/folder.png";
import computerIcon from "../assets/icons/computer.png";
import recycleBinIcon from "../assets/icons/recycle-bin.png";
import browserIcon from "../assets/icons/browser.png";

interface DraggableWindowProps {
  name: string;
  onClose: () => void;
  bringToFront: () => void;
  isActive: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  isMaximized: boolean;
}

const DraggableWindow: React.FC<DraggableWindowProps> = ({
  name,
  onClose,
  bringToFront,
  isActive,
  onMinimize,
  onMaximize,
  isMaximized,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 150, y: 150 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    bringToFront();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

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
        left: isMaximized ? 0 : position.x,
        top: isMaximized ? 0 : position.y,
        width: isMaximized ? "100%" : "400px",
        height: isMaximized ? "calc(100vh - 50px)" : "300px",
        zIndex: isActive ? 1000 : 1,
        border: "2px solid #000080",
        backgroundColor: "#F0F0F0",
        boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.3)",
        display: isMaximized || isActive ? "block" : "none",
      }}
    >
      <div
        className="window-header"
        onMouseDown={handleMouseDown}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 8px",
          background: "linear-gradient(to bottom, #0A5CC0, #0854A0)",
          color: "white",
          position: "relative",
          borderBottom: "1px solid white",
        }}
      >
        <span>{name}</span>
        <div className="window-controls" style={{ display: "flex", gap: "4px" }}>
          <button
            style={{
              width: "24px",
              height: "24px",
              background: "#A0C0E0",
              border: "1px solid white",
              color: "black",
            }}
            onClick={onMinimize}
          >
            _
          </button>
          <button
            style={{
              width: "24px",
              height: "24px",
              background: "#A0C0E0",
              border: "1px solid white",
              color: "black",
            }}
            onClick={onMaximize}
          >
            {isMaximized ? "❐" : "□"}
          </button>
          <button
            style={{
              width: "24px",
              height: "24px",
              background: "red",
              color: "white",
              border: "1px solid white",
            }}
            onClick={onClose}
          >
            X
          </button>
        </div>
      </div>
      <div className="window-content" style={{ backgroundColor: "white", height: "calc(100% - 30px)", border: "1px solid #000080" }}>
        {/* Blank canvas for future content */}
      </div>
    </div>
  );
};

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [maximizedWindows, setMaximizedWindows] = useState<{ [key: string]: boolean }>({});
  const [minimizedWindows, setMinimizedWindows] = useState<{ [key: string]: boolean }>({});

  const openWindow = (windowName: string) => {
    if (!openWindows.includes(windowName)) {
      setOpenWindows([...openWindows, windowName]);
    }
    setMinimizedWindows((prev) => ({ ...prev, [windowName]: false }));
    setActiveWindow(windowName);
  };

  const closeWindow = (windowName: string) => {
    setOpenWindows(openWindows.filter((w) => w !== windowName));
    setActiveWindow(null);
  };

  return (
    <div className="desktop">
      <Icon name="Recycle Bin" image={recycleBinIcon} onClick={() => openWindow("Recycle Bin")} />
      <Icon name="Projects" image={folderIcon} onClick={() => openWindow("Projects")} />
      <Icon name="Experiences" image={folderIcon} onClick={() => openWindow("Experiences")} />
      <Icon name="My Computer" image={computerIcon} onClick={() => openWindow("My Computer")} />
      <Icon name="Browser" image={browserIcon} onClick={() => openWindow("Browser")} />

      {openWindows.map((window) => (
        <DraggableWindow
          key={window}
          name={window}
          onClose={() => closeWindow(window)}
          bringToFront={() => setActiveWindow(window)}
          isActive={!minimizedWindows[window] && activeWindow === window}
          onMinimize={() => setMinimizedWindows((prev) => ({ ...prev, [window]: true }))}
          onMaximize={() => setMaximizedWindows((prev) => ({ ...prev, [window]: !prev[window] }))}
          isMaximized={maximizedWindows[window] || false}
        />
      ))}
      <Taskbar openWindows={openWindows} closeWindow={closeWindow} />
    </div>
  );
};

export default Desktop;
