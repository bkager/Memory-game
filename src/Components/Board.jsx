import { useState } from "react";
import Card from "./Card";
import themes from "./CardSets";
import ThemeButton from "./ThemeButton";

let clickCount = 0;
let prevCardUp = "";
let prevCardNums = [];
let match = false;
let rounds = 0;

console.log("Themes : ", themes["Tropical"]);
//Unshuffled array of image data: this is static data and so stays outside of the function component
// const unshuffledImages = themes["Tropical"];

//shuffleImages takes the array of unshuffled images and adds two copies of each in random order to a new array

//Ok, the problem is that we're storing the actual images in shuffledImages. We'd be better off storing an array of index numbers. 
function shuffleImages(array) {
  array = array.slice(1);
  const unshuffled = [...array, ...array];
  let results = [];
  //console.log("Unshuffled at start of function: ", unshuffled);

  while (unshuffled[0] !== undefined) {
    //console.log("Unshuffled in while loop: ", [...unshuffled]);
    let i = Math.floor(Math.random() * unshuffled.length);
    results.push(unshuffled[i]);
    unshuffled.splice(i, 1);
  }
  return results;
}

//Invokes shuffleCards to create an array of shuffled image data that can be used to create cards

function Board() {
  let [theme, setTheme] = useState(() => "Tropical");
  let unshuffledImages = themes[theme];
  //const shuffledImages = [];

  let [shuffledImages, setShuffledImages] = useState(() => shuffleImages(unshuffledImages)
  );

  let initialSides = Array(shuffledImages.length).fill("back");
  let [sides, setSides] = useState(initialSides);

  function done() {
    return sides.includes("back") ? false : true;
  }

  let isDone = done();

  function findStatus() {
    if (rounds <= 1 && clickCount < 2) {
      return "";
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

  const handleClick = (i, alt) => {
    clickCount++;
    let newSides = sides.slice();
    console.log("Clickcount: ", clickCount);

    if (clickCount === 1) {
      rounds++;
      newSides[i] = "front";
      prevCardUp = alt;
      prevCardNums.push(i);
      console.log(prevCardUp, prevCardNums);
      return setSides(() => newSides);
    }

    if (clickCount === 2) {
      if (sides[i] === "front") {
        clickCount = 1;
        rounds++;
        console.log("Clickcount: ", clickCount);
        return;
      }
      newSides[i] = "front";
      prevCardNums.push(i);
      console.log(prevCardUp, prevCardNums);
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
        console.log("Clickcount: ", clickCount);
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
          console.log("Clickcount: ", clickCount);
          newSides[i] = "front";
          prevCardUp = alt;
          prevCardNums.push(i);
          console.log(prevCardUp, prevCardNums);
          return setSides(() => newSides);
        }
      }

      if (match) {
        clickCount = 0;
        console.log("Clickcount: ", clickCount);
        prevCardUp = "";
        prevCardNums = [];

        if (newSides[i] === "front") {
          return;
        } else {
          clickCount = 1;
          rounds++;
          console.log("Clickcount: ", clickCount);

          newSides[i] = "front";
          prevCardUp = alt;
          prevCardNums.push(i);
          console.log(prevCardUp, prevCardNums);
          return setSides(() => newSides);
        }
      }
    }
  };

  //Generate an array of <Card /> components from shuffled array, giving each one an image icon and a clickHandler; done once at start of round
  //  individual cards re-render as clicked
  const cardArray = shuffledImages.map((image, i) => {
    return (
      <Card
        side={sides[i]} //"back" or "front"
        picture={image.icon}
        backPattern={unshuffledImages[0]}
        alt={image.alt}
        key={i}
        onClick={() => handleClick(i, image.alt)}
      />
    );
  });

  //Generate array of ThemeButton components to allow user to change card theme
  let themeNames = Object.keys(themes);

  function themeChanger(themeName) {
    console.log("I clicked a theme button: " + themeName);
    if (theme === themeName) {
      return;
    }
    setTheme(themeName);
    //setShuffledImages(() => shuffleImages(unshuffledImages));
  }

  const themeButtonArray = themeNames.map((themeName, i) => {
    return (
      <ThemeButton
        themeName={themeName}
        key={i}
        clickHandler={() => themeChanger(themeName)}
      />
    );
  });


  return (
    <div>
      <div id="dashboard">
        <h1>{status}</h1>
        <h1>Rounds: {rounds}</h1>
      </div>
      <div>{cardArray}</div>
      <div>{themeButtonArray}</div>
    </div>
  );
}

export default Board;
