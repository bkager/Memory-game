function Dashboard ({rounds, status}) {
  return (
    <div id="dashboard">
      <p>Rounds: {rounds}</p>
      <p>{status}</p>
    </div>
  )
}

export default Dashboard; 