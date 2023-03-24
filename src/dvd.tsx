// Import necessary libraries
import React, { useState, useEffect, useRef } from "react";

const maxY = 91;
const maxX = 88;

// Create a TVScreen component
const TVScreen: React.FC = () => {
  const dvdRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [position, setPosition] = useState({
    x: Math.random() * maxX,
    y: Math.random() * maxY,
  });
  // Set a random starting direction state between -3 and -1 or 1 and 3 for both x and y
  const [direction, setDirection] = useState({
    x: Math.random() < 0.5 ? Math.random() * 2 - 3 : Math.random() * 2 + 1,
    y: Math.random() < 0.5 ? Math.random() * 2 - 3 : Math.random() * 2 + 1,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => {
        if (!dvdRef.current || !containerRef.current) return prevPosition;

        const dvdRect = dvdRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        let newX = prevPosition.x + direction.x;
        let newY = prevPosition.y + direction.y;

        let newDirectionX = direction.x;
        let newDirectionY = direction.y;

        // Check if the logo hits the horizontal boundaries and reverse the x direction
        if (newX < 0 || newX + dvdRect.width > containerRect.width) {
          newDirectionX = -direction.x;
          newX = newX < 0 ? 0 : containerRect.width - dvdRect.width;
        }
        // Check if the logo hits the vertical boundaries and reverse the y direction
        if (newY < 0 || newY + dvdRect.height > containerRect.height) {
          newDirectionY = -direction.y;
          newY = newY < 0 ? 0 : containerRect.height - dvdRect.height;
        }

        setDirection({ x: newDirectionX, y: newDirectionY });

        return { x: newX, y: newY };
      });
    }, 10);

    return () => clearInterval(interval);  // Fixed the syntax error by removing the extra space before the closing parenthesis
  }, [direction]);

  return (
    <div className="dvd-container" style={{ position: "relative" }} ref={containerRef}>
      <img
        ref={dvdRef}
        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/f9fd1ce8-6cd6-446b-a8b5-fc5cea739a59/d5vkgzp-51764afc-0c0a-40f2-a578-ed215e254885.png/v1/fill/w_1024,h_590,strp/dvd___white_logo_by_gbmpersonal_d5vkgzp-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTkwIiwicGF0aCI6IlwvZlwvZjlmZDFjZTgtNmNkNi00NDZiLWE4YjUtZmM1Y2VhNzM5YTU5XC9kNXZrZ3pwLTUxNzY0YWZjLTBjMGEtNDBmMi1hNTc4LWVkMjE1ZTI1NDg4NS5wbmciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.-iVmvm3ZQE0H9JeVHM99GPyh_DPX5TIfE1vAD1gttno"
        alt="DVD Logo"
        style={{
position: "absolute",
          width: "70px",
          color: "#FFF",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </div>
  );
};

export default TVScreen;
