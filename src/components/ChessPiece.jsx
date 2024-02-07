import React from "react";
import PropTypes from "prop-types";

const ChessPiece = ({ type }) => {
	const pieceClassName = `piece ${type.type} ${type.color}`;

	return <div className={pieceClassName}></div>;
};

ChessPiece.propTypes = {
	type: PropTypes.shape({
		type: PropTypes.string.isRequired,
		color: PropTypes.string.isRequired,
	}).isRequired,
};

export default ChessPiece;
