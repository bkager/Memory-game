import { useState } from "react";
import Card from "./Card";
import themes from "./Themes";
import ThemeButton from "./ThemeButton";
import Dashboard from "./Dashboard";

let clickCount = 0;
let prevCardUp = "";
let prevCardNums = [];
let match = false;
let rounds = 0;


//Invokes shuffleCards to create an array of shuffled image data that can be used to create cards

function Board() {
  //Theme is the chosen set of card images, corresponding to the keys in the themes object. 

  let [theme, setTheme] = useState(() => "Tropical");
 
  // unshuffledNums contains each number 1-18 twice (36 numbers total). These are the index numbers of the card images in the array of images for each theme. Each number occurs twice in order to add a matching pair of each image to the game. Index numbers start from 1 because the first image in the array for each theme is the back-of-card pattern. 

  const unshuffledNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  // shuffleCardIndices shuffles the numbers in the unshuffledNums array into random order. 

  function shuffleCardIndices(array) {
    let results = [];

    while (array[0] !== undefined) {
      let i = Math.floor(Math.random() * array.length);
      results.push(array[i]);
      array.splice(i, 1);
    }
    return results;
  }

  // shuffledCardIndices is the array of randomized numbers 1-18 used as indices for the cards in the theme array. Currently does not need to be state, but probably needs to be state for future planned features. 
  let [shuffledCardIndices, setShuffledCardIndices] = useState(() => shuffleCardIndices(unshuffledNums)
  );

  // The "sides" state variable holds an array of string values to track whether each card is face up("front") or face down("back"). "initialSides" creates an array with a "back" value for each card, which is used for the initial state of the gameboard and for resets. 
  let initialSides = Array(shuffledCardIndices.length).fill("back");
  let [sides, setSides] = useState(initialSides);

  // The data for each visual theme is held in the themes object, with the theme name as the key and an array of image data as the value. The themeArray variable has the value of the array of image data for the currently selected theme. 
  const themeArray = themes[theme];

  // Calculates whether all matches have been found, ending the game.
  function done() {
    return sides.includes("back") ? false : true;
  }

  let isDone = done();

  // The findStatus function returns a message for the player about the state of the game.
  function findStatus() {
    if (rounds <= 1 && clickCount < 2) {
      return "Play!";
    }
    if (isDone) {
      return "Success! You found all matches!";
    } else if (!match) {
      return "No match :(";
    } else if (match) {
      return "Match found! :)";
    }
  }

  let status = findStatus();

  // Reset the game board
  function newGameClickHandler () {
    status = "New game";
    rounds = 0; 
    setShuffledCardIndices(()=> shuffleCardIndices(unshuffledNums));
    setSides(() => (initialSides)); 
  }

  //Handles clicks on game cards
  const handleCardClick = (i, alt) => {
    clickCount++;
    let newSides = sides.slice();

    if (clickCount === 1) {
      rounds++;
      newSides[i] = "front";
      prevCardUp = alt;
      prevCardNums.push(i);
      return setSides(() => newSides);
    }

    if (clickCount === 2) {
      if (sides[i] === "front") {
        clickCount = 1;
        rounds++;
        return;
      }
      newSides[i] = "front";
      prevCardNums.push(i);
      if (alt === prevCardUp) {
        match = true;
      } else {
        match = false;
      }

      return setSides(() => newSides);
    }

    if (clickCount === 3) {
      if (!match) {
        let [j, k] = prevCardNums;
        newSides[j] = "back";
        newSides[k] = "back";
        clickCount = 0;
        prevCardUp = "";
        let tempCardNums = [...prevCardNums];
        prevCardNums = [];

        if (
          newSides[i] === "front" ||
          i === tempCardNums[0] ||
          i === tempCardNums[1]
        ) {
          setSides(() => newSides);
        } else {
          clickCount = 1;
          rounds++;
          newSides[i] = "front";
          prevCardUp = alt;
          prevCardNums.push(i);
          return setSides(() => newSides);
        }
      }

      if (match) {
        clickCount = 0;
        prevCardUp = "";
        prevCardNums = [];

        if (newSides[i] === "front") {
          return;
        } else {
          clickCount = 1;
          rounds++;

          newSides[i] = "front";
          prevCardUp = alt;
          prevCardNums.push(i);
          return setSides(() => newSides);
        }
      }
    }
  };

  //Generate an array of <Card /> components, using the randomized numbers in shuffledCardIndices to access the image data in themeArray. 

  const cardArray = shuffledCardIndices.map((num, i) => {

    const currImage = themeArray[num];
    const { icon, alt } = currImage; 
  
    return (
      <Card
        side={sides[i]} //"back" or "front"
        icon={icon}
        alt={alt}
        key={i}
        onClick={() => handleCardClick(i, alt)}
        backPattern={themeArray[0]}
      />
    );
  });

  
  // Handles clicks on ThemeButton components. 
  function themeButtonClickHandler(themeName) {
    if (theme === themeName) {
      return;
    }
    setTheme(themeName);
  }
  
  // Get names of all themes from themes object
  let themeNames = Object.keys(themes);
  
  //Generate array of ThemeButton components to display the available card themes and allow the user to change the current theme.
  const themeButtonArray = themeNames.map((themeName, i) => {
    return (
      <ThemeButton
        themeName={themeName}
        key={i}
        clickHandler={() => themeButtonClickHandler(themeName)}
      />
    );
  });

  // Returns game board with cards, status display, and theme picker buttons. 
  return (
    <div>
      <div id="header">
        <Dashboard rounds={rounds} status={status} newGameClickHandler={newGameClickHandler}/>
      </div>
      <div id="cardLayout">{cardArray}</div>
      <div id="theme-bar">
        <div>{themeButtonArray}</div>
      </div>
    </div>
  );
}

export default Board;
