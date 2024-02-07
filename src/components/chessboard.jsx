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
	// State to store the valid moves for the selected piece
	const [validMoves, setValidMoves] = useState([]);
	// State to store the valid capture moves for the selected piece
	const [captureMoves, setCaptureMoves] = useState([]);

	// Function to handle the click on the squares
	const handleSquareClick = (row, col) => {
		// If no piece is selected, select the piece if it's the player's turn
		if (!selectedPiece) {
			const piece = board[row][col];
			if (piece && piece.color === playerTurn) {
				// Calculate valid moves for the selected piece
				const { moves, captureMoves } = calculateValidMoves(
					piece.type,
					piece.color,
					row,
					col
				);
				// Set the selected piece and its valid moves
				setSelectedPiece({
					type: piece.type,
					color: piece.color,
					row,
					col,
					moves: moves || [],
					captureMoves: captureMoves || [],
				});
				// Set the valid moves and capture moves for the selected piece
				setValidMoves(moves || []);
				setCaptureMoves(captureMoves || []);
			}
		} else {
			// If a piece is selected, move the piece if the square is a valid move
			const {
				type,
				color,
				row: fromRow,
				col: fromCol,
				moves,
				captureMoves,
			} = selectedPiece;
			// Check if the selected square is a valid move
			const isValidMove = moves.some(
				(move) => move.row === row && move.col === col
			);
			const isValidCaptureMove = captureMoves.some(
				(move) => move.row === row && move.col === col
			);

			// If the selected square is a valid move, move the piece
			if (isValidMove || isValidCaptureMove) {
				const newBoard = [...board];
				newBoard[row][col] = { type, color };
				newBoard[fromRow][fromCol] = null;

				// Update board state with the new piece positions
				setBoard(newBoard);
				// Reset the selected piece
				setSelectedPiece(null);
				// Change the player's turn
				setPlayerTurn(playerTurn === "white" ? "black" : "white");
				// Reset valid moves and capture moves
				setValidMoves([]);
				setCaptureMoves([]);
			} else {
				console.log("Invalid move");

				// Reset the selected piece
				setSelectedPiece(null);
				// Reset valid moves and capture moves
				setValidMoves([]);
				setCaptureMoves([]);
			}
		}
	};

	// Function to calculate valid moves for a selected piece
	const calculateValidMoves = (type, color, row, col) => {
		// Array to store valid moves
		const moves = [];
		const captureMoves = [];

		// Pawn movement logic
		if (type === "pawn") {
			const direction = color === "white" ? -1 : 1;
			if (!board[row + direction][col]) {
				moves.push({ row: row + direction, col });
			}
			// Can move two squares if it's the first move
			if (
				((color === "white" && row === 6) ||
					(color === "black" && row === 1)) &&
				!board[row + direction][col] &&
				!board[row + 2 * direction][col]
			) {
				moves.push({ row: row + 2 * direction, col });
			}
			// Check diagonal squares for opponent pieces
			if (
				col > 0 &&
				board[row + direction][col - 1] &&
				board[row + direction][col - 1]?.color !== color
			) {
				captureMoves.push({ row: row + direction, col: col - 1 });
			}
			if (
				col < maxSquares - 1 &&
				board[row + direction][col + 1] &&
				board[row + direction][col + 1]?.color !== color
			) {
				captureMoves.push({ row: row + direction, col: col + 1 });
			}
		}

		// Rook movement logic
		if (type === "rook") {
			// Check upward direction for both valid moves and capture moves
			for (let i = row - 1; i >= 0; i--) {
				if (!board[i][col]) {
					// If the square is empty, it's a valid move
					moves.push({ row: i, col });
				} else {
					// If the square contains a piece
					if (board[i][col].color !== color) {
						// If the piece is of the opposite color, it's a capture move
						captureMoves.push({ row: i, col });
					}
					break; // Stop checking further in this direction
				}
			}
			// Check downward direction for both valid moves and capture moves
			for (let i = row + 1; i < maxSquares; i++) {
				if (!board[i][col]) {
					moves.push({ row: i, col });
				} else {
					if (board[i][col].color !== color) {
						captureMoves.push({ row: i, col });
					}
					break;
				}
			}
			// Check left direction for both valid moves and capture moves
			for (let j = col - 1; j >= 0; j--) {
				if (!board[row][j]) {
					moves.push({ row, col: j });
				} else {
					if (board[row][j].color !== color) {
						captureMoves.push({ row, col: j });
					}
					break;
				}
			}
			// Check right direction for both valid moves and capture moves
			for (let j = col + 1; j < maxSquares; j++) {
				if (!board[row][j]) {
					moves.push({ row, col: j });
				} else {
					if (board[row][j].color !== color) {
						captureMoves.push({ row, col: j });
					}
					break;
				}
			}
		}

		// Knight movement logic
		if (type === "knight") {
			const knightMoves = [
				{ row: row - 2, col: col - 1 },
				{ row: row - 2, col: col + 1 },
				{ row: row - 1, col: col - 2 },
				{ row: row - 1, col: col + 2 },
				{ row: row + 1, col: col - 2 },
				{ row: row + 1, col: col + 2 },
				{ row: row + 2, col: col - 1 },
				{ row: row + 2, col: col + 1 },
			];
			knightMoves.forEach((move) => {
				const { row: toRow, col: toCol } = move;
				if (
					toRow >= 0 &&
					toRow < maxSquares &&
					toCol >= 0 &&
					toCol < maxSquares
				) {
					if (!board[toRow][toCol]) {
						moves.push(move); // Add the move to the valid moves array if the square is empty
					} else if (board[toRow][toCol].color !== color) {
						captureMoves.push(move); // Add to captureMoves only if there's an opponent's piece
					}
				}
			});
		}

		// Bishop movement logic
		if (type === "bishop") {
			// Check diagonal squares in all four directions
			const directions = [
				{ rowDir: -1, colDir: -1 }, // Up-Left
				{ rowDir: -1, colDir: 1 }, // Up-Right
				{ rowDir: 1, colDir: -1 }, // Down-Left
				{ rowDir: 1, colDir: 1 }, // Down-Right
			];
			directions.forEach(({ rowDir, colDir }) => {
				let i = 1;
				while (true) {
					const checkRow = row + i * rowDir;
					const checkCol = col + i * colDir;
					if (
						checkRow < 0 ||
						checkRow >= maxSquares ||
						checkCol < 0 ||
						checkCol >= maxSquares
					) {
						break; // If outside the board, stop checking in this direction
					}
					if (!board[checkRow][checkCol]) {
						moves.push({ row: checkRow, col: checkCol }); // Add to moves if the square is empty
					} else {
						if (board[checkRow][checkCol].color !== color) {
							captureMoves.push({ row: checkRow, col: checkCol }); // Add to captureMoves if it's an opponent's piece
						}
						break; // Stop checking further in this direction if a piece is encountered
					}
					i++;
				}
			});
		}

		// Queen movement logic (combination of rook and bishop)
		if (type === "queen") {
			// Rook-like movement
			const rookDirections = [
				{ rowDir: -1, colDir: 0 }, // Up
				{ rowDir: 1, colDir: 0 }, // Down
				{ rowDir: 0, colDir: -1 }, // Left
				{ rowDir: 0, colDir: 1 }, // Right
			];
			rookDirections.forEach(({ rowDir, colDir }) => {
				let i = 1;
				while (true) {
					const checkRow = row + i * rowDir;
					const checkCol = col + i * colDir;
					if (
						checkRow < 0 ||
						checkRow >= maxSquares ||
						checkCol < 0 ||
						checkCol >= maxSquares
					) {
						break; // If outside the board, stop checking in this direction
					}
					if (!board[checkRow][checkCol]) {
						moves.push({ row: checkRow, col: checkCol }); // Add to moves if the square is empty
					} else {
						if (board[checkRow][checkCol].color !== color) {
							captureMoves.push({ row: checkRow, col: checkCol }); // Add to captureMoves if it's an opponent's piece
						}
						break; // Stop checking further in this direction if a piece is encountered
					}
					i++;
				}
			});

			// Bishop-like movement
			const bishopDirections = [
				{ rowDir: -1, colDir: -1 }, // Up-Left
				{ rowDir: -1, colDir: 1 }, // Up-Right
				{ rowDir: 1, colDir: -1 }, // Down-Left
				{ rowDir: 1, colDir: 1 }, // Down-Right
			];
			bishopDirections.forEach(({ rowDir, colDir }) => {
				let i = 1;
				while (true) {
					const checkRow = row + i * rowDir;
					const checkCol = col + i * colDir;
					if (
						checkRow < 0 ||
						checkRow >= maxSquares ||
						checkCol < 0 ||
						checkCol >= maxSquares
					) {
						break; // If outside the board, stop checking in this direction
					}
					if (!board[checkRow][checkCol]) {
						moves.push({ row: checkRow, col: checkCol }); // Add to moves if the square is empty
					} else {
						if (board[checkRow][checkCol].color !== color) {
							captureMoves.push({ row: checkRow, col: checkCol }); // Add to captureMoves if it's an opponent's piece
						}
						break; // Stop checking further in this direction if a piece is encountered
					}
					i++;
				}
			});
		}

		// King movement logic
		if (type === "king") {
			const kingMoves = [
				{ row: row - 1, col: col - 1 }, // Up-Left
				{ row: row - 1, col }, // Up
				{ row: row - 1, col: col + 1 }, // Up-Right
				{ row, col: col - 1 }, // Left
				{ row, col: col + 1 }, // Right
				{ row: row + 1, col: col - 1 }, // Down-Left
				{ row: row + 1, col }, // Down
				{ row: row + 1, col: col + 1 }, // Down-Right
			];
			kingMoves.forEach((move) => {
				const { row: moveRow, col: moveCol } = move;
				if (
					moveRow >= 0 &&
					moveRow < maxSquares &&
					moveCol >= 0 &&
					moveCol < maxSquares
				) {
					if (!board[moveRow][moveCol]) {
						moves.push(move); // Add to moves if the square is empty
					} else {
						if (board[moveRow][moveCol].color !== color) {
							captureMoves.push(move); // Add to captureMoves if it's an opponent's piece
						}
					}
				}
			});
		}

		return { moves, captureMoves };
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
							} ${
								validMoves.some(
									(move) => move.row === rowIndex && move.col === colIndex
								)
									? "valid-move"
									: ""
							} ${
								captureMoves.some(
									(move) => move.row === rowIndex && move.col === colIndex
								)
									? "capture-move"
									: ""
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
