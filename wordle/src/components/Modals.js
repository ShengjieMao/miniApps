import React from "react";

// after the game ends
export default function Modal({ isCorrect, solution, turn }) {
  return (
    <div className="modal">
      {isCorrect && (
        <div>
          <h1>You Win!</h1>
          <p className="solution">{solution}</p>
          <p>You found the word in {turn} guesses!</p>
        </div>
      )}
      {!isCorrect && (
        <div>
          <h1>Uh Oh</h1>
          <p className="solution">{solution}</p>
          <p>Better luck next time</p>
        </div>
      )}
    </div>
  );
}
