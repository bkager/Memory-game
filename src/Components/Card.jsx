
function Card({ side, backPattern, icon, alt, onClick}) {
  let imageToShow = "";
  if (side === "back") {
    imageToShow = backPattern;
  } else if (side === "front") {
    imageToShow = icon;
  }

  return (
    <img
      src={imageToShow}
      alt={alt}
      onClick={onClick}
      height="150"
      width="150"
      className="card"
    />
  );
}

export default Card;
