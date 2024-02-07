// Import React, useState, useEffect
import React, { useState, useEffect } from "react";
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
	// State to store if the move is invalid
	const [isInvalid, setIsInvalid] = useState(false);

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
				setIsInvalid(false);
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
				// Reset isInvalid
				setIsInvalid(false);
			} else {
				// If the selected square is not a valid move, set isInvalid to true
				setIsInvalid(true);
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

	// Function to determine the color of each piece based on its row
	const getPieceColor = (rowIndex) => {
		return rowIndex < maxSquares / 2 ? "black" : "white";
	};

	// Render the chessboard
	return (
		<div>
			<h2 className={playerTurn === "white" ? "white-turn" : "black-turn"}>
				{playerTurn.charAt(0).toUpperCase() + playerTurn.slice(1)}'s turn
			</h2>
			<h2 className={isInvalid ? "invalid" : ""}>
				{isInvalid
					? "Invalid Move!"
					: selectedPiece
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
			{/* <h3 className="invalid">{isInvalid ? "Invalid Move!" : ""}</h3> */}
		</div>
	);
};

// Export the Chessboard component
export default Chessboard;
