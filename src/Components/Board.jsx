import React, { useState } from "react";
import Card from "./Card";

//Unshuffled array of image data: this is static data and so stays outside of the function component
const unshuffledImages = [
  { icon: "/images/bird-of-paradise.png", alt: "Bird of Paradise" },
  { icon: "/images/coconut-drink.png", alt: "coconut drink" },
  { icon: "/images/crab.png", alt: "crab" },
  { icon: "/images/jellyfish.png", alt: "jellyfish" },
  { icon: "/images/parrot.png", alt: "parrot" },
  { icon: "/images/sea-turtle.png", alt: "sea turtle" },
  { icon: "/images/butterfly.png", alt: "butterfly" },
  { icon: "/images/dragon-fruit.png", alt: "dragon fruit" },
  { icon: "/images/flamingo.png", alt: "flamingo" },
  { icon: "/images/flower-necklace.png", alt: "flower necklace" },
  { icon: "/images/island.png", alt: "island" },
  { icon: "/images/lime.png", alt: "lime" },
  { icon: "/images/papaya.png", alt: "papaya" },
  { icon: "/images/pineapple.png", alt: "pineapple" },
  { icon: "/images/sea.png", alt: "sea" },
  { icon: "/images/snorkel.png", alt: "snorkel" },
  { icon: "/images/starfish.png", alt: "starfish" },
  { icon: "/images/tropical-fish.png", alt: "tropical fish" },
];

//shuffleImages takes the array of unshuffled images and adds two copies of each in random order to a new array,
function shuffleImages(array) {
  const unshuffled = [...array, ...array];
  let results = [];
  console.log("Unshuffled at start of function: ", unshuffled);

  while (unshuffled[0] !== undefined) {
    console.log("Unshuffled in while loop: ", [...unshuffled]);
    let i = Math.floor(Math.random() * unshuffled.length);
    results.push(unshuffled[i]);
    unshuffled.splice(i, 1);
  }
  return results;
}

//Invokes shuffleCards to create an array of shuffled image data that can be used to create cards

const shuffledImages = shuffleImages(unshuffledImages);

let clickCount = 0;
let prevCardUp = "";
let prevCardNums = [];
let match = false;
let rounds = 0;

function Board() {
  let initialSides = Array(shuffledImages.length).fill("back");

  let [sides, setSides] = useState(initialSides);

  function done() {
    return sides.includes("back") ? false : true;
  }

  let isDone = done();

  function findStatus() {
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
        alt={image.alt}
        key={i}
        onClick={() => handleClick(i, image.alt)}
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
    </div>
  );
}

export default Board;
