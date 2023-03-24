import React, { useState, useEffect, useRef } from "react";

const Gameo: React.FC = () => {
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const [renderedPosition, setRenderedPosition] = useState({ x: 0, y: 0 });
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>(
    {}
  );

  const lerp = (start: number, end: number, t: number) => {
    return start * (1 - t) + end * t;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    setKeysPressed((prev) => ({ ...prev, [event.key]: true }));
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    setKeysPressed((prev) => ({ ...prev, [event.key]: false }));
  };

  useEffect(() => {
    const gameLoop = () => {
      const t = 0.1; // Adjust this value to control the smoothness of the animation
      const acceleration = 0.1; // Adjust this value to control the acceleration of the movement
      const decceleration = 0.05; // Adjust this value to control the decceleration of the movement

      let newX = targetPositionRef.current.x;
      let newY = targetPositionRef.current.y;

      if (keysPressed["w"]) {
        newY -= 10;
      }
      if (keysPressed["a"]) {
        newX -= 10;
      }
      if (keysPressed["s"]) {
        newY += 10;
      }
      if (keysPressed["d"]) {
        newX += 10;
      }

      targetPositionRef.current = { x: newX, y: newY };

      setRenderedPosition((prev) => ({
        x: lerp(
          prev.x,
          targetPositionRef.current.x,
          t + acceleration * Math.abs(targetPositionRef.current.x - prev.x)
        ),
        y: lerp(
          prev.y,
          targetPositionRef.current.y,
          t + acceleration * Math.abs(targetPositionRef.current.y - prev.y)
        ),
      }));

      if (
        Math.abs(targetPositionRef.current.x - renderedPosition.x) < 1 &&
        Math.abs(targetPositionRef.current.y - renderedPosition.y) < 1
      ) {
        setRenderedPosition(targetPositionRef.current);
      }

      requestAnimationFrame(gameLoop);
    };

    gameLoop();
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keysPressed]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: `${renderedPosition.x}px`,
          top: `${renderedPosition.y}px`,
        }}
      >
        🌳
      </div>
    </div>
  );
};

export default Gameo;
