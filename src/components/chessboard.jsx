// Import React, useState, useEffect
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ChessPiece from "./ChessPiece";
import "./chessboard.css";
import "./chesspiece.css";

// Define Chessboard component
const Chessboard = () => {
	// Max amount of squares in rows and columns
	const maxSquares = 8;

	// Array to store the pieces and squares at the start of the game
	const [board, setBoard] = useState([
		[
			{ type: "rook", color: "black" },
			{ type: "knight", color: "black" },
			{ type: "bishop", color: "black" },
			{ type: "queen", color: "black" },
			{ type: "king", color: "black" },
			{ type: "bishop", color: "black" },
			{ type: "knight", color: "black" },
			{ type: "rook", color: "black" },
		],
		[
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
			{ type: "pawn", color: "black" },
		],
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		Array(maxSquares).fill(null),
		[
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
			{ type: "pawn", color: "white" },
		],
		[
			{ type: "rook", color: "white" },
			{ type: "knight", color: "white" },
			{ type: "bishop", color: "white" },
			{ type: "queen", color: "white" },
			{ type: "king", color: "white" },
			{ type: "bishop", color: "white" },
			{ type: "knight", color: "white" },
			{ type: "rook", color: "white" },
		],
	]);

	// State to store the selected piece
	const [selectedPiece, setSelectedPiece] = useState(null);
	// State to store the player's turn, White goes first
	const [playerTurn, setPlayerTurn] = useState("white");

	// Function to handle the click on the squares
	const handleSquareClick = (row, col) => {
		if (!selectedPiece) {
			// If no piece is selected, check if the clicked square contains a piece
			const piece = board[row][col];
			console.log(piece);
			console.log(playerTurn);
			if (piece && piece.color === playerTurn) {
				// If the square contains a piece, select it
				setSelectedPiece({
					type: piece.type,
					color: piece.color,
					row,
					col,
				});
			}
		} else {
			// If a piece is already selected, attempt to move it to the clicked square
			const { type, color, row: selectedRow, col: selectedCol } = selectedPiece;

			// Validate the move
			if (validateMove(type, color, selectedRow, selectedCol, row, col)) {
				const newBoard = [...board];
				newBoard[row][col] = { type, color };
				newBoard[selectedRow][selectedCol] = null;

				// Update the board
				setBoard(newBoard);
				// Reset the selected piece
				setSelectedPiece(null);
				// Change the player's turn
				setPlayerTurn(playerTurn === "white" ? "black" : "white");
			} else {
				console.log("Invalid move");
				setSelectedPiece(null);
			}
		}
	};

	// Function to validate the move of a piece
	const validateMove = (type, color, fromRow, fromCol, toRow, toCol) => {
		switch (type) {
			case "pawn":
				// Pawn movement logic
				//Can only move forward one square, or two squares if it's the first move
				const direction = color === "white" ? -1 : 1;
				if (
					toRow === fromRow + direction &&
					toCol === fromCol &&
					!board[toRow][toCol]
				) {
					return true;
				} else if (
					toRow === fromRow + direction * 2 &&
					toCol === fromCol &&
					fromRow === (color === "white" ? 6 : 1) &&
					!board[toRow][toCol] &&
					!board[fromRow + direction][toCol]
				) {
					return true;
				}
				return false;

			case "rook":
				// Rook movement logic
				if (fromRow === toRow || fromCol === toCol) {
					// Check if the move is either horizontal or vertical
					const rowDiff = Math.abs(toRow - fromRow);
					const colDiff = Math.abs(toCol - fromCol);
					// Ensure there are no pieces in the way
					if (
						(rowDiff > 0 && !isPieceBetweenRows(fromRow, toRow, fromCol)) ||
						(colDiff > 0 && !isPieceBetweenCols(fromCol, toCol, fromRow))
					) {
						// Check if the destination square is empty
						if (!board[toRow][toCol]) {
							return true;
						}
					}
				}
				return false;

			case "knight":
				// Knight movement logic
				const kRowDiff = Math.abs(toRow - fromRow);
				const kColDiff = Math.abs(toCol - fromCol);
				// Check if the move forms an L-shape (2 squares in one direction, 1 in the other)
				if (
					(kRowDiff === 2 && kColDiff === 1) ||
					(kRowDiff === 1 && kColDiff === 2)
				) {
					// Check if the destination square is empty
					if (!board[toRow][toCol]) {
						return true;
					}
				}
				return false;

			case "bishop":
				// Bishop movement logic
				const bRowDiff = Math.abs(toRow - fromRow);
				const bColDiff = Math.abs(toCol - fromCol);
				// Check if the move is diagonal
				if (bRowDiff === bColDiff) {
					// Determine the direction of movement
					const bRowDirection = toRow > fromRow ? 1 : -1;
					const bColDirection = toCol > fromCol ? 1 : -1;
					// Check if there are any pieces in the way
					for (let i = 1; i < bRowDiff; i++) {
						const checkRow = fromRow + i * bRowDirection;
						const checkCol = fromCol + i * bColDirection;
						if (board[checkRow][checkCol]) {
							return false; // If a piece is in the way, the move is invalid
						}
					}
					// Check if the destination square is empty
					if (!board[toRow][toCol]) {
						return true;
					}
				}
				return false;

			case "queen":
				// Queen movement logic (combination of rook and bishop)
				const rowDiffQueen = Math.abs(toRow - fromRow);
				const colDiffQueen = Math.abs(toCol - fromCol);
				const rowDiffRook = Math.abs(toRow - fromRow);
				const colDiffRook = Math.abs(toCol - fromCol);
				// Check if the move is vertical or horizontal (rook movement)
				if (
					(rowDiffQueen === 0 && colDiffQueen !== 0) ||
					(rowDiffQueen !== 0 && colDiffQueen === 0)
				) {
					const rowDirection =
						rowDiffQueen !== 0 ? (toRow > fromRow ? 1 : -1) : 0;
					const colDirection =
						colDiffQueen !== 0 ? (toCol > fromCol ? 1 : -1) : 0;
					for (let i = 1; i < Math.max(rowDiffRook, colDiffRook); i++) {
						const checkRow = fromRow + i * rowDirection;
						const checkCol = fromCol + i * colDirection;
						if (board[checkRow][checkCol]) {
							return false;
						}
					}
					if (!board[toRow][toCol]) {
						return true;
					}
				}
				// Check if the move is diagonal (bishop movement)
				else if (rowDiffQueen === colDiffQueen) {
					const rowDirection = toRow > fromRow ? 1 : -1;
					const colDirection = toCol > fromCol ? 1 : -1;
					for (let i = 1; i < rowDiffQueen; i++) {
						const checkRow = fromRow + i * rowDirection;
						const checkCol = fromCol + i * colDirection;
						if (board[checkRow][checkCol]) {
							return false;
						}
					}
					if (!board[toRow][toCol]) {
						return true;
					}
				}
				return false;

			case "king":
				// King movement logic
				const rowDiff = Math.abs(toRow - fromRow);
				const colDiff = Math.abs(toCol - fromCol);
				// Check if the move is one square away in any direction
				if (
					(rowDiff === 1 && colDiff === 0) ||
					(rowDiff === 0 && colDiff === 1) ||
					(rowDiff === 1 && colDiff === 1)
				) {
					if (!board[toRow][toCol]) {
						return true;
					}
				}
				return false;
		}
	};

	// Function to determine the color of each piece based on its row
	const getPieceColor = (rowIndex) => {
		return rowIndex < maxSquares / 2 ? "black" : "white";
	};

	// Helper function to check if there is any piece between the start and end row
	const isPieceBetweenRows = (startRow, endRow, col) => {
		const step = Math.sign(endRow - startRow);
		for (let row = startRow + step; row !== endRow; row += step) {
			if (board[row][col]) {
				return true;
			}
		}
		return false;
	};

	// Helper function to check if there is any piece between the start and end column
	const isPieceBetweenCols = (startCol, endCol, row) => {
		const step = Math.sign(endCol - startCol);
		for (let col = startCol + step; col !== endCol; col += step) {
			if (board[row][col]) {
				return true;
			}
		}
		return false;
	};

	// Render the chessboard
	return (
		<div>
			<h2>{playerTurn.charAt(0).toUpperCase() + playerTurn.slice(1)}'s turn</h2>
			<h2>
				{selectedPiece
					? `Selected Piece: ${
							selectedPiece.type.charAt(0).toUpperCase() +
							selectedPiece.type.slice(1)
					  }`
					: "No piece selected"}
			</h2>
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
								<ChessPiece type={piece} color={getPieceColor(rowIndex)} />
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

// Export the Chessboard component
export default Chessboard;
