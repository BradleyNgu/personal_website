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
        <div className="portfolio" />
      )}
    </div>
  );
};

export default App;
