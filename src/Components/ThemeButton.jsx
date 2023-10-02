import React from "react";

function ThemeButton(props) {
  return <button onClick={props.clickHandler}>{props.themeName}</button>;
}

export default ThemeButton;
