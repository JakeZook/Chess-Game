import React, { useState } from "react";
import Piece from "./ChessPiece";
import "./chessboard.css";
import "./chesspiece.css";

const Chessboard = () => {
	//Max amount of squares in rows and columns
	const maxSquares = 8;

	//Array to store the pieces and squares at the start of game
	const [board, setBoard] = useState([
		["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
		["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
		["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
	]);

	const [selectedPiece, setSelectedPiece] = useState(null);

	//Function to handle the click on the squares
	const handleSquareClick = (row, col) => {
		//If there is no selected piece, select the piece to blank square
		if (!selectedPiece) {
			const piece = board[row][col];
			if (piece) {
				setSelectedPiece({ type: piece, row, col });
			}
		} else {
			//If there is a selected piece, move the piece to the selected square
			const { type, row: selectedRow, col: selectedCol } = selectedPiece;
			const newBoard = [...board];
			newBoard[row][col] = type;
			newBoard[selectedRow][selectedCol] = null;
			setBoard(newBoard);
			setSelectedPiece(null);
		}
	};

	return (
		<div className="chessboard">
			{board.map((row, rowIndex) =>
				row.map((piece, colIndex) => (
					<div
						key={`${rowIndex}-${colIndex}`}
						className={`square ${
							(rowIndex + colIndex) % 2 === 0 ? "light" : "dark"
						}`}
						onClick={() => handleSquareClick(rowIndex, colIndex)}
					>
						{piece && (
							<Piece type={piece} color={rowIndex < 2 ? "black" : "white"} />
						)}
					</div>
				))
			)}
		</div>
	);
};

export default Chessboard;
