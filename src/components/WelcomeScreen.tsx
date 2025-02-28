import React, { useEffect, useState } from "react";

const asciiArt = `

:--===---------::::--:----:-----::::::::::..-===--:::::::...:::::::::::::::::::....:----:::-----:..:
:===-::::----:::-::::::------------::::::::-+=::.:::----::::::::::::::::::-::::...:--:--::::---:...:
==---:..:---:::--::--:::::::::-------::::-+=----::::..::::::--:--:::::::::::---:..:--:------:..:::.:
-::--:::::------:::-------:::::::::--::=======-----::.::--::--:::::::::::::::::.:---------:::::..:::
...:-::--------:::-:---------::-:::------=+=====+===-::---::::::------:::::::--------::::::::::....:
-----::-----------::---:::::----:::=+=-=++++++==+++==----------------::::-------:::--:::-::::......:
------::::::-:::----=-----:---::--:---+**#######*+*++++++++====--------::::::::::::--::::.....:::::-
----------::::----==-:---------=-----+##%%##%%%#%%#*#########*+==-----::::::::-------::::::::::..:-=
-------=--::::--===+=----::--===--=++#%%#%%%%@@%%%%%%%%%#######**+------::::::::--:::::::::::::...:-
::::---::-=--------------===-----+**#%%%%%%%%@@@@@%%%@@@@%%%%%%#**++-::----::::--::::::::::::::::::-
::::::::::-====--------------::-+####%%@%%%%%%%%%%%%#%%%%@@@@@%%#**++=::::::::::::::::::::::::::::::
------:-::--===-----------::::-=####%%@@%%######*********#%%%@%%%#**+==:.:::-::::::::::-::---:----::
--=--::::.:--:--------==------+#%%#%%@@%%%###**++++==++++**#%%%%%####++::::::::::---::-------:---:::
:::--::::::--::::-=****+===-=*#%%%%%%@%%###**++++====+==++**##%%%%####*+-:::::::---------:::::------
::::--::------=+**++=-::::-=+%%%%%%%%%%%###**++++=====+++++**##%%%%%%##*+--:-:::-:::..:::::::::::--:
-::------=+***+=-::::::::-==%%%%%%%@%%%###**+++=======+++++**###%%%%%%%#*-::::-:::::.....::--:::::::
-===-::-+**+--:::::---:-===+%#%%%%@@%####**++++=======++++++**##%%%%%%%%#--::::::::::::::::---=-::::
:::::-+**+-:::::::::-===---*%%%%@@@%%###**++++=======++++++++*###%%@%%%%%=---::::::::::::::::::-:::-
----=**=-::.::::---==-:..::#@@%%@@%%########**+++++++**#######%%%%@@@@@%%#-:::::::::::::::::::--::::
+***=::::::::-==++-::::::::-#@@@@%%####%#%%%%##**++**######*####%%@@@@@@@%-::::::::::::::::::::::::-
+=----::--=+++=-:::-::::::.:*%@@%%###******#####*++***#****###*##%@@@@@@@%+-::::::::::::::::::::::--
-::-==++++==-:::::::::::::::=@@%%#+***#%#%%%###*++++*####%%%%%###%%@@@@@@**::::::::::::::::::::::::-
==++*+=-:---:::::::::::::::::#%%#==+*++***###***+==+*************##@@@@@%#+::::::::-:::::::::::::::-
++=-:-----------:::::::::::::=*#*-====++****+++=====++++*****+++++*%@@%%#*-:::-----------::::::::::-
::::::::::---:::--:::::::::::-=*=----======++==----===+++++=====+++*%%@*=:::--::-------=--:::::::---
:::----::::::::::::::::::::::-=++------=====+==--=====++*+++===+=+++*#*-:::-==--:----::-------::::.:
----:-::::::::::::::::--::::::-==----===++**+-===+++++++****++++++==+==--------:::-:-::::--:::::::::
:::::::::::::----:::::::--:::::--=-==+++*****+*#****###********+++===-::-:--::-===-:::-----::::::::-
::.::::::::::::--:::::::::--::::--==++*#***+++****#*********#***++=-::::::::-:--=+=----:--::::::::::
::.:::::----:.:---::::--:::--::::-==+******++++++++***+++*******++=--:::::----===++===--:---------=+
.:::::------::::::::-:---:::::::::-==++**####***********#%#***++++=-=-:-----=====++++====--=+=+=---+
::::----:-::-==::-::::-----::::::::==+++***##++======++*#***++++++**#**++**++**++*++++++++++*+=----=
::::---:::::--====++-:---::--::::---==++++++++++++++****++++++**+*%%%%%%%%%#******+++++++++**+=+-:--
::------:::::::-++++=-=----::::-::--====++====+********++++++***+%@%%%%##*########*+====++*##*-:::-=
::--:::::--------+**++---:::::-----=**+=======+++*****+++++++***+%%@%###%%%%%%%##%#=::----===-:.:::-
:::::::-------===+**+=-::::-++*+*****#@%===--===++++++++==+++***+#%%%%%%%%%%%%%%%*%+:--====+-:::-::-
::-=++====+++++******+==++=*#*-:+###%@@@+==========+====+++*****%%%%%%%%%%%%%%%%%%#=-=====---==+=---
==+*%#****########*+***++++##*+*%#%@@@@@#=====++++**++++*****#%%%%%%%%%%%%%%%%%%%%%*-:::::::-==++=--
#***##**#####%%%##*++**++=*###%@%%%@@@@@@====+*******####**#%@@@%%%%%%%%%%%%%%######*-.::::::-=+==-=
**+***#***#%%####*++***+++###%@%%@@@@@@@@*===+**######****#%@@@@@%%%%%%%%%%%%########*-::::::-----==
*=---=##**#%%#**#**+****+=+*#@@#%@@@@@@@@*===++*********#%@@@@%%%%%%%%%%%%%%%#######***-:::::---:--=
+=====##***###**+====---::-*#%%%%@@@@@@@@#====++*******#%%@@%%%%%%%%%%%%%%%%########***+----::-::---
+=====*#+==------:::::::..-*#%%%%@@@@@@@@#+===+++*******%%%%@%%%%%%%%%%%%%%%%%%%%%%%%%%%#=::::::::::
=+*****=::::::::::::::::..-*#%%%%%@@@@@@%#++=++++**++*##*%%%%%%%%%%%%%%%%%%%%@@%%%%%%%#%%*:::......:
-++**+=::::::::-:::::::.:-+*##%%%%%%@@@@%**+++++++**#%%%%%%%%%%%%%%%%%%%@@@%%%%%####%%%%#=.......:::
-==++=-::::::--=-:::::-=****###%%%%%%@@@#*++++++++*##%%%%%%%%%%%%%%%@@@@%%%%%%#%%%@@@%#**+==+=-:::::
----==----:::-==-:::-+##*#%###%%%%%%%%%%*++====++*###%%%%%%%%%%%%@@@%%%%%%%%@@@@@%%%%%****+++++**+--
-----=:::::::::::::+*###%#%%%#*#%%##%%%%*=======*####%%%%%%%%%@@@%%%%%%%@@@@@@%%%%%%##%%%##****==***
------:::::::::::=*#%%%%##%%%%#%%%%%%%%%%#=-===*###%%%%%%%%@@@@@%%@@@@@%%%%%%%#%%###%#%%@@@%%#######
------:::::::::-+*##%%%%%%%%%%%%@@%%%%%%%%%%#+###%%#%%%%%@@@@@%%##%%%%%%%%#%##%%######%%%%%%%%#%%%##
--------::::::-+####%%%%%%%##%#%@@@%@@@@@@@@%#*##%%#%@@@@@@@%%###%%%%%%%##%##%#####%#**######%%%#%##
---::::-------+####%%%%######%%@@@@%%%%%@@%%######%#%@@@@@@%###%@@%%%%%%#%%#%#######%@%%#%%%%%%%%##%
:-:----------+####%%%%######%@#@@@@%%%%%%%##%%#%@@%%@@@@@%###%@@@@%%%%%#%%#%%######%%%#%%%%##%%##%%%
----------::=#%##%%%%######%%@%@@%%%%%%%%###%##%@@%%@@@@%###%@@@@%%%%%##%%%%######%%#######%%%##%%%%
------------#%%%%%%#######%%@%%%%%%%%%%%###%%#%@@@%%@@@%##%@@@@@%%%%%###%%%######%%#######%%%##%%%%%








██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗                                      
██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝                                      
██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗                                        
██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝                                        
╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗                                      
 ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝                                      
                                                                                                    
████████╗ ██████╗     ███╗   ███╗██╗   ██╗    ██╗    ██╗███████╗██████╗ ███████╗██╗████████╗███████╗
╚══██╔══╝██╔═══██╗    ████╗ ████║╚██╗ ██╔╝    ██║    ██║██╔════╝██╔══██╗██╔════╝██║╚══██╔══╝██╔════╝
   ██║   ██║   ██║    ██╔████╔██║ ╚████╔╝     ██║ █╗ ██║█████╗  ██████╔╝███████╗██║   ██║   █████╗  
   ██║   ██║   ██║    ██║╚██╔╝██║  ╚██╔╝      ██║███╗██║██╔══╝  ██╔══██╗╚════██║██║   ██║   ██╔══╝  
   ██║   ╚██████╔╝    ██║ ╚═╝ ██║   ██║       ╚███╔███╔╝███████╗██████╔╝███████║██║   ██║   ███████╗
   ╚═╝    ╚═════╝     ╚═╝     ╚═╝   ╚═╝        ╚══╝╚══╝ ╚══════╝╚═════╝ ╚══════╝╚═╝   ╚═╝   ╚══════╝    
`;

interface WelcomeScreenProps {
  onComplete: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let index = 0;
    const asciiLines = asciiArt.trim().split("\n").map((line) => line.trimEnd());

    const interval = setInterval(() => {
      if (index < asciiLines.length) {
        setLines((prevLines) => [...prevLines, asciiLines[index]]);
        index++;
        setProgress((prev) => Math.min(prev + (100 / asciiLines.length), 100));
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 1500);
      }
    }, 65); // Reduced interval time to 65ms for faster printing

    return () => clearInterval(interval);
  }, [onComplete]);

  const progressBar = () => {
    const totalLength = 50;
    const filledLength = Math.round((progress / 100) * totalLength);
    const emptyLength = totalLength - filledLength;
    return `+${"#".repeat(filledLength)}${" ".repeat(emptyLength)}+`;
  };

  return (
    <div
      className="ascii-terminal"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        backgroundColor: "black",
        color: "white",
        position: "relative",
      }}
    >
      {lines.map((line, i) => (
        <pre key={i} style={{ margin: 0, lineHeight: 1.1 }}>{line}</pre>
      ))}
      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          textAlign: "center",
          color: "white",
          fontFamily: "monospace",
        }}
      >
        <pre style={{ margin: 0 }}>{progressBar()}</pre>
      </div>
    </div>
  );
};

export default WelcomeScreen;

