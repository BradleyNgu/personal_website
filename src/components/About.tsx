import React from "react";

const About: React.FC = () => {
  return (
    <div style={{ fontFamily: "Tahoma, sans-serif", backgroundColor: "#E4E4E4", padding: "20px", border: "2px solid #000", width: "600px", margin: "50px auto", boxShadow: "5px 5px 15px rgba(0,0,0,0.3)" }}>
      <div style={{ backgroundColor: "#000080", color: "#FFF", padding: "10px", borderBottom: "2px solid #000" }}>
        <h1 style={{ margin: 0 }}>About Me</h1>
      </div>
      <div style={{ padding: "20px", backgroundColor: "#FFF" }}>
        <p>Hello! I'm Bradley, a passionate developer with a love for creating amazing web applications.</p>
        <p>Welcome to my personal website. Here you can find more about my projects, skills, and experiences.</p>
      </div>
    </div>
  );
};

export default About;
