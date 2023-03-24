import React, { useState, useEffect, useRef } from "react";
import "./randomjoke.scss";

interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

// const steamid = '76561197960435530'; // Replace with the user's Steam ID
// const apikey = 'YOUR_API_KEY'; // Replace with your Steam Web API key
// const url = `https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/?key=${apikey}&itemcount=1&publishedfileids[0]=&creator_appid=0&consumer_appid=0&creator=${steamid}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     const numItems = data.response.publishedfiledetails.length;
//     console.log(`User has created ${numItems} workshop items.`);
//   })
//   .catch(error => console.error(error));

const RandomJoke: React.FC = () => {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [showPunchline, setShowPunchline] = useState<boolean>(false); // Add state to control punchline visibility
  const [memes, setMemes] = useState<any[]>([]); // Add state to store fetched memes
  const [memeUrl, setMemeUrl] = useState<string>(""); // Add state to store meme URL
  const hasFetchedJoke = useRef(false);

  const fetchJoke = async () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
        { signal }
      );
      const data: Joke = await response.json();
      setJoke(data);
      setShowPunchline(false); // Reset punchline visibility when fetching a new joke
    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Fetch error:", error);
      }
    }

    return () => {
      abortController.abort();
    };
  };

  const fetchMemes = async () => {
    try {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const data = await response.json();
      setMemes(data.data.memes);
    } catch (error) {
      console.error("Fetch memes error:", error);
    }
  };

  const getRandomMeme = () => {
    const randomMeme = memes[Math.floor(Math.random() * memes.length)]; // Select a random meme from the fetched memes
    setMemeUrl(randomMeme.url);
  };

  const handleNewJoke = () => {
    getRandomMeme();
    setJoke(null);
    setTimeout(() => {
      fetchJoke();
    }, 2500); // Wait for 3 seconds before fetching a new joke
  };

  useEffect(() => {
    if (!hasFetchedJoke.current) {
      fetchJoke(); // Fetch a joke on initial load
      fetchMemes(); // Fetch memes only once on initial load
      hasFetchedJoke.current = true;
    }
    return () => {
      const abortController = new AbortController();
      abortController.abort();
    };
  }, []);

  useEffect(() => {
    if (memes.length > 0) {
      getRandomMeme(); // Get a random meme from the fetched memes array
    }
  }, [memes]);

  return (
    <div className="joke-container">
      {joke ? (
        <>
          <p className="joke-setup-text">{joke.setup}</p>{" "}
          {showPunchline ? (
            <p className="joke-punchline-text">{joke.punchline}</p>
          ) : null}
          {!showPunchline ? (
            <button
              className="button-punchline"
              onClick={() => setShowPunchline(true)}
            >
              Reveal Punchline
            </button>
          ) : (
            <button className="button-newjoke" onClick={handleNewJoke}>
              Get another joke
            </button>
          )}
        </>
      ) : (
        <>
          <p className="new-joke-load">Fetching a new joke...</p>
          <img src={memeUrl} alt="Random Meme" style={{ width: "600px" }} />
        </>
      )}
    </div>
  );
};

export default RandomJoke;
