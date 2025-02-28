import React, { useState, useEffect } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import Desktop from "./components/Desktop";

const App: React.FC = () => {
  const [showDesktop, setShowDesktop] = useState(false);

  // Effect to change the tab title dynamically
  useEffect(() => {
    if (showDesktop) {
      document.title = "Bradley's Profile"; // Set title after welcome screen
    } else {
      document.title = "Welcome to My Website"; // Initial title
    }
  }, [showDesktop]); // Runs when showDesktop changes

  return (
    <div className="App">
      {!showDesktop ? <WelcomeScreen onComplete={() => setShowDesktop(true)} /> : <Desktop />}
    </div>
  );
};

export default App;
