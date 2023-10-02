import React from "react";

function Card(props) {
  let imageToShow = "";
  if (props.side === "back") {
    imageToShow = props.backPattern;
  } else if (props.side === "front") {
    imageToShow = props.picture;
  }

  return (
    <img
      src={imageToShow}
      alt={props.alt}
      onClick={props.onClick}
      height="150"
      width="150"
      className="card"
    />
  );
}

export default Card;
