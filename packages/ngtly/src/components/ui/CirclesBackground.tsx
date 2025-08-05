import React from "react";

const CirclesBackground = () => {
	const floatKeyframes = `
    @keyframes float {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(-500px);
      }
    }
  `;

	const generateAnimationProperties = () => {
		const animationProps = [];

		for (let i = 0; i < 3; i++) {
			const delay = Math.random() * 2;
			const duration = Math.random() * 4 + 2;

			animationProps.push({ delay, duration });
		}

		return animationProps;
	};

	const generateCircles = () => {
		const animationProps = generateAnimationProperties();

		return animationProps.map((props, index) => {
			const size = Math.floor(Math.random() * 1000) + 500;
			const top = Math.random() * 100;
			const left = Math.random() * 100;

			const { delay, duration } = props;

			const circleAnimation = `float ${duration}s infinite ease-in-out alternate`;
			const circleAnimationWithDelay = `${circleAnimation} ${delay}s`;

			return (
				<div
					key={index + size + top + left}
					className="rounded-full border-white opacity-20 absolute -z-10"
					style={{
						border: "1px solid",
						width: `${size}px`,
						height: `${size}px`,
						top: `${top}%`,
						left: `${left}%`,
						animation: circleAnimationWithDelay,
					}}
				/>
			);
		});
	};

	return (
		<div className="inset-0 pointer-events-none">
			<style>{floatKeyframes}</style>
			{generateCircles()}
		</div>
	);
};

export default CirclesBackground;
