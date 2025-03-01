import React, { useState, useEffect } from "react";
import Icon from "./Icon";
import Taskbar from "./Taskbar";
import "./../styles/desktop.css";

import folderIcon from "../assets/icons/folder.png";
import computerIcon from "../assets/icons/computer.png";
import recycleBinIcon from "../assets/icons/recycle-bin.png";
import browserIcon from "../assets/icons/browser.png";

interface Folder {
  name: string;
  icon: string;
}

const folders: Folder[] = [
  { name: "Recycle Bin", icon: recycleBinIcon },
  { name: "Projects", icon: folderIcon },
  { name: "Experiences", icon: folderIcon },
  { name: "My Computer", icon: computerIcon },
  { name: "Browser", icon: browserIcon },
];

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
        width: isMaximized ? "100%" : "300px",
        height: isMaximized ? "calc(100vh - 50px)" : "200px", // Ensures taskbar is visible
        zIndex: isActive ? 1000 : 1,
        border: "2px solid #000080",
        backgroundColor: "#B0C4DE",
      }}
    >
      <div className="window-header" onMouseDown={handleMouseDown} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 8px', background: 'linear-gradient(to bottom, #0A5CC0, #0854A0)', color: 'white', position: 'relative', borderBottom: '1px solid white' }}>
        <span>{name}</span>
        <div className="window-controls" style={{ display: 'flex', gap: '4px', position: 'absolute', right: '8px', top: '4px' }}>
          <button style={{ width: '24px', height: '24px', background: '#A0C0E0', border: '1px solid white', color: 'black' }} onClick={onMinimize}>_</button>
          <button style={{ width: '24px', height: '24px', background: '#A0C0E0', border: '1px solid white', color: 'black' }} onClick={onMaximize}>□</button>
          <button style={{ width: '24px', height: '24px', background: 'red', color: 'white', border: '1px solid white' }} onClick={onClose}>X</button>
        </div>
      </div>
      <div className="window-content" style={{ padding: '10px', backgroundColor: '#F0F0F0' }}>Contents of {name}</div>
    </div>
  );
};

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<string[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [maximizedWindows, setMaximizedWindows] = useState<{ [key: string]: boolean }>({});
  const [minimizedWindows, setMinimizedWindows] = useState<{ [key: string]: boolean }>({});

  const openFolder = (folder: string) => {
    if (!openWindows.includes(folder)) {
      setOpenWindows([...openWindows, folder]);
    }
    setMinimizedWindows((prev) => ({ ...prev, [folder]: false }));
    setActiveWindow(folder);
  };

  const closeFolder = (folder: string) => {
    setOpenWindows(openWindows.filter((win) => win !== folder));
    setActiveWindow(openWindows.length > 1 ? openWindows[0] : null);
  };

  const minimizeFolder = (folder: string) => {
    setMinimizedWindows((prev) => ({ ...prev, [folder]: true }));
    setActiveWindow(null);
  };

  const toggleMaximizeFolder = (folder: string) => {
    setMaximizedWindows((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  return (
    <div className="desktop">
      {folders.map((folder) => (
        <div key={folder.name} className="folder-icon" onClick={() => openFolder(folder.name)}
          style={{ width: '64px', height: '64px', margin: '20px', textAlign: 'center', display: 'inline-block' }}>
          <img src={folder.icon} alt={folder.name} style={{ width: '100%', height: '100%' }} />
          <div style={{ textAlign: 'center', marginTop: '5px' }}>{folder.name}</div>
        </div>
      ))}

      {openWindows.map((folder) => (
        !minimizedWindows[folder] && (
          <DraggableWindow
            key={folder}
            name={folder}
            onClose={() => closeFolder(folder)}
            onMinimize={() => minimizeFolder(folder)}
            onMaximize={() => toggleMaximizeFolder(folder)}
            bringToFront={() => setActiveWindow(folder)}
            isActive={activeWindow === folder}
            isMaximized={maximizedWindows[folder] || false}
          />
        )
      ))}

      <Taskbar openWindows={openWindows} closeWindow={closeFolder} />
    </div>
  );
};

export default Desktop;
