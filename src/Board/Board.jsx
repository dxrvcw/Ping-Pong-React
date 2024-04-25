import classes from "./Board.module.css";
import { useState, useEffect, useRef } from "react";

export default function Board() {
	const playerWidth = 10;
	const playerHeight = useRef(200);
	const playerStep = 30;

	const ballStep = 5;
	const ballInterval = 10;

	const screenWidth = window.innerWidth;
	const screenHeight = window.innerHeight;

	const [score, setScore] = useState(0);

	const [playerY, setPlayerY] = useState(screenHeight / 2);
	const [ballX, setBallX] = useState(screenWidth / 2);
	const [ballY, setBallY] = useState(screenHeight / 2);
	const [playable, setPlayable] = useState(false);

	function moveHandler(e) {
		if (e.key === "ArrowDown" && playerY + playerHeight.current < screenHeight)
			setPlayerY(playerY + playerStep);
		if (e.key === "ArrowUp" && playerY > 0) setPlayerY(playerY - playerStep);
	}

	let goingUp = useRef(false);
	let goingRight = useRef(true);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setBallY((prevY) => {
				if (prevY > screenHeight) goingUp.current = true;
				if (prevY < 0) goingUp.current = false;
				if (goingUp.current) return prevY - ballStep;
				return prevY + ballStep;
			});
			setBallX((prevX) => {
				if (prevX > screenWidth) goingRight.current = false;
				if (goingRight.current) return prevX + ballStep;
				if (prevX < 20) {
					if (ballY > playerY && ballY < playerY + playerHeight.current) {
						setScore((prev) => prev + 10);
						goingRight.current = true;
						playerHeight.current -= 10;
					} else setPlayable(false);
				}
				return prevX - ballStep;
			});
		}, ballInterval);
		if (!playable) clearInterval(intervalId);
		return () => clearInterval(intervalId);
	}, [playerY, ballY, playable, screenHeight, screenWidth]);

	return (
		<div
			style={{
				width: screenWidth,
				height: screenHeight,
				background: "grey",
				padding: "10px",
			}}
			onKeyDown={moveHandler}
			tabIndex={0}>
			<p>Score: {score} </p>
			{!playable && (
				<dialog className={classes.modal}>
					<p>Score: {score}</p>

					<button
						onClick={() => {
							setPlayable(true);
							setBallX(screenWidth / 2);
							setBallY(screenHeight / 2);
							goingRight.current = true;
							playerHeight.current = 200;
							setScore(0);
							setPlayable(true);
						}}
						style={{
							border: "2px solid black",
							padding: "10px",
							borderRadius: "10px",
						}}>
						Start!
					</button>
				</dialog>
			)}

			<div
				className={classes.player}
				style={{
					width: playerWidth + "px",
					height: playerHeight.current + "px",
					translate: `0 ${playerY}px`,
				}}></div>
			<div
				className={classes.ball}
				style={{
					left: ballX + "px",
					top: ballY + "px",
				}}></div>
		</div>
	);
}
