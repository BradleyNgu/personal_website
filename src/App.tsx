import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import "./styles/App.css";

const App: React.FC = () => {
  const [showPortfolio, setShowPortfolio] = useState(false);

  return (
    <div className="App">
      {!showPortfolio ? (
        <WelcomeScreen onComplete={() => setShowPortfolio(true)} />
      ) : (
        <div className="portfolio">
          <h1 style={{ color: "white" }}>Welcome to my portfolio!</h1>
        </div>
      )}
    </div>
  );
};

export default App;
