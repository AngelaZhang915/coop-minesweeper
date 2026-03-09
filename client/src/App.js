import React from "react"
import Board from "./Board"

export default function App() {
  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h1>Co-op Minesweeper</h1>
      <Board />
    </div>
  )
}