import ResetButton from "./ResetButton";

function Dashboard ({rounds, status}) {
  return (
    <div id="dashboard">
        <button>Rounds: {rounds}</button>
        <button>{status}</button>
        <ResetButton />
    </div>
  )
}

export default Dashboard; 