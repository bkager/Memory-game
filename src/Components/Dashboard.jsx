import ResetButton from "./ResetButton";

function Dashboard ({rounds, status, newGameClickHandler}) {
  return (
    <div id="dashboard">
        <button>Rounds: {rounds}</button>
        <button>{status}</button>
        <ResetButton newGameClickHandler={newGameClickHandler}/>
    </div>
  )
}

export default Dashboard; 