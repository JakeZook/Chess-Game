import React from "react";
import "./chessboard.css";

const Chessboard = () => {
	//Max amount of squares in rows and columns
	const maxSquares = 8;
	//Array to store the squares - init to empty
	const squares = [];

	//Loop through the rows and columns to create the squares and assign them a color
	for (let row = 0; row < maxSquares; row++) {
		for (let col = 0; col < maxSquares; col++) {
			const squareColor = (row + col) % 2 === 0 ? "white" : "black";
			squares.push(
				<div key={`${row}-${col}`} className={`square ${squareColor}`} />
			);
		}
	}

	return <div className="chessboard">{squares}</div>;
};

export default Chessboard;
