import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import Desktop from "./components/Desktop";

const App: React.FC = () => {
  const [showDesktop, setShowDesktop] = useState(false);

  return (
    <div className="App">
      {!showDesktop ? <WelcomeScreen onComplete={() => setShowDesktop(true)} /> : <Desktop />}
    </div>
  );
};

export default App;
