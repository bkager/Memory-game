import { useState } from "react";
import Card from "./Card";
import themes from "./CardSets";
import ThemeButton from "./ThemeButton";

let clickCount = 0;
let prevCardUp = "";
let prevCardNums = [];
let match = false;
let rounds = 0;


//Unshuffled array of image data: this is static data and so stays outside of the function component
// const unshuffledImages = themes["Tropical"];

//shuffleImages takes the array of unshuffled images and adds two copies of each in random order to a new array

//Ok, the problem is that we're storing the actual images in shuffledImages. We'd be better off storing an array of index numbers. 
function shuffleImages(array) {
  let nums = array; 
  let results = [];
  //console.log("Unshuffled indices at start of function: ", array);

  while (array[0] !== undefined) {
    //console.log("Unshuffled indices in while loop: ", [...array]);
    let i = Math.floor(Math.random() * array.length);
    results.push(array[i]);
    array.splice(i, 1);
  }
  //console.log(`Unshuffled array: ${nums}`)
  //console.log("Shuffled images: " + results)
  return results;
}

//Invokes shuffleCards to create an array of shuffled image data that can be used to create cards

function Board() {
  let [theme, setTheme] = useState(() => "Tropical");
  //let unshuffledImages = themes[theme];
  //const shuffledImages = [];
  const unshuffledNums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]

  let [shuffledImages, setShuffledImages] = useState(() => shuffleImages(unshuffledNums)
  );
  //console.log(`ShuffledImages: ${shuffledImages}`)
  //console.log(`Theme: ${theme}. Theme array: ${themes[theme][1]["icon"]}`)

  let initialSides = Array(shuffledImages.length).fill("back");
  let [sides, setSides] = useState(initialSides);
  //themeArray is the array in the themes object whose key is the current theme name
  const themeArray = themes[theme];
  //console.log("Theme array: " + themeArray);

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
  const cardArray = shuffledImages.map((num, i) => {

    const currImage = themeArray[num];
    const { icon, alt } = currImage; 
  
    return (
      <Card
        side={sides[i]} //"back" or "front"
        icon={icon}
        alt={alt}
        key={i}
        onClick={() => handleClick(i, alt)}
        backPattern={themeArray[0]}
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
