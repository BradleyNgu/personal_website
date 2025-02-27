import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import "./styles/App.css";

const App: React.FC = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <div className="App">
      {showPortfolio ? (
        <div className="portfolio">
          <h1>Welcome to my portfolio!</h1>
        </div>
      ) : (
        <WelcomeScreen onComplete={() => setShowPortfolio(true)} />
      )}
    </div>
  );
};

export default App;
