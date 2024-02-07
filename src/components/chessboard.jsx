import React from "react";
import Piece from "./ChessPiece";
import "./chessboard.css";

const Chessboard = () => {
	//Max amount of squares in rows and columns
	const maxSquares = 8;

	//Array to store the pieces and squares at the start of game
	const InitialBoard = [
		["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
		["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		["pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn", "pawn"],
		["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"],
	];

	//Map the initial board to create the squares and pieces
	const squares = InitialBoard.map((row, rowIndex) =>
		row.map((piece, columnIndex) => {
			return (
				<div
					key={`${rowIndex}-${columnIndex}`}
					className={`${
						(rowIndex + columnIndex) % 2 === 0 ? "black" : "white"
					} square`}
				>
					{piece && (
						<Piece type={piece} color={rowIndex < 2 ? "black" : "white"} />
					)}
				</div>
			);
		})
	);

	return <div className="chessboard">{squares}</div>;
};

export default Chessboard;
