import React from "react";
import PropTypes from "prop-types";

const ChessPiece = ({ type, color }) => {
	const pieceClassName = `piece ${type} ${color}`;

	return <div className={pieceClassName}></div>;
};

ChessPiece.propTypes = {
	type: PropTypes.string.isRequired,
	color: PropTypes.string.isRequired,
};

export default ChessPiece;
