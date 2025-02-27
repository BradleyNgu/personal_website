import React, { useEffect, useState } from "react";

const asciiArt = `
 ___       __   _______   ___       ________  ________  _____ ______   _______           _________  ________         
|\  \     |\  \|\  ___ \ |\  \     |\   ____\|\   __  \|\   _ \  _   \|\  ___ \         |\___   ___\\   __  \        
\ \  \    \ \  \ \   __/|\ \  \    \ \  \___|\ \  \|\  \ \  \\\__\ \  \ \   __/|        \|___ \  \_\ \  \|\  \       
 \ \  \  __\ \  \ \  \_|/_\ \  \    \ \  \    \ \  \\\  \ \  \\|__| \  \ \  \_|/__           \ \  \ \ \  \\\  \      
  \ \  \|\__\_\  \ \  \_|\ \ \  \____\ \  \____\ \  \\\  \ \  \    \ \  \ \  \_|\ \           \ \  \ \ \  \\\  \     
   \ \____________\ \_______\ \_______\ \_______\ \_______\ \__\    \ \__\ \_______\           \ \__\ \ \_______\    
    \|____________|\|_______|\|_______|\|_______|\|_______|\|__|     \|__|\|_______|            \|__|  \|_______|    
                                                                                                                     
                                                                                                                     
                                                                                                                     
 ________  ________  ________  ________  ___       _______       ___    ___ ________                                 
|\   __  \|\   __  \|\   __  \|\   ___ \|\  \     |\  ___ \     |\  \  /  /|\   ____\                                
\ \  \|\ /\ \  \|\  \ \  \|\  \ \  \_|\ \ \  \    \ \   __/|    \ \  \/  / | \  \___|_                               
 \ \   __  \ \   _  _\ \   __  \ \  \ \\ \ \  \    \ \  \_|/__   \ \    / / \ \_____  \                              
  \ \  \|\  \ \  \\  \\ \  \ \  \ \  \_\\ \ \  \____\ \  \_|\ \   \/  /  /   \|____|\  \                             
   \ \_______\ \__\\ _\\ \__\ \__\ \_______\ \_______\ \_______\__/  / /       ____\_\  \                            
    \|_______|\|__|\|__|\|__|\|__|\|_______|\|_______|\|_______|\___/ /       |\_________\                           
                                                               \|___|/        \|_________|                           
                                                                                                                     
                                                                                                                     
 ________  ________  ________  _________  ________ ________  ___       ___  ________                                 
|\   __  \|\   __  \|\   __  \|\___   ___\\  _____\\   __  \|\  \     |\  \|\   __  \                                
\ \  \|\  \ \  \|\  \ \  \|\  \|___ \  \_\ \  \__/\ \  \|\  \ \  \    \ \  \ \  \|\  \                               
 \ \   ____\ \  \\\  \ \   _  _\   \ \  \ \ \   __\\ \  \\\  \ \  \    \ \  \ \  \\\  \                              
  \ \  \___|\ \  \\\  \ \  \\  \|   \ \  \ \ \  \_| \ \  \\\  \ \  \____\ \  \ \  \\\  \                             
   \ \__\    \ \_______\ \__\\ _\    \ \__\ \ \__\   \ \_______\ \_______\ \__\ \_______\                            
    \|__|     \|_______|\|__|\|__|    \|__|  \|__|    \|_______|\|_______|\|__|\|_______|                            
                                                                                              
`; 

interface WelcomeScreenProps {
    onComplete: () => void;
  }
  
  const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
      let index = 0;
      const asciiLines = asciiArt.split("\n");
      const interval = setInterval(() => {
        if (index < asciiLines.length) {
          setLines((prevLines) => [...prevLines, asciiLines[index]]);
          index++;
        } else {
          clearInterval(interval);
          setTimeout(onComplete, 1500); // Switches to Portfolio
        }
      }, 200);
      return () => clearInterval(interval);
    }, [onComplete]);
    
    return (
      <div className="ascii-terminal" style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          backgroundColor: "black",
          color: "white"  // ✅ Ensures white font
      }}>
        {lines.map((line, i) => (
          <pre key={i}>{line}</pre>
        ))}
      </div>
    );
  
  };
  
  export default WelcomeScreen;