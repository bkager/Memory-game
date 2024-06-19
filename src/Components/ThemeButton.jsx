
function ThemeButton( { clickHandler, themeName}) {
  return <button onClick={clickHandler}>{themeName}</button>;
}

export default ThemeButton;
