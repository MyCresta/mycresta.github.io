import React, { useState, useEffect } from 'react';
import image from './haddock2.gif';
import './haddockquotes.scss';

// Read quotes from the "quotes.txt" file based on user locale
const readQuotesFromFile = async () => {
  const userLocale = navigator.language;
  const isSwedish = userLocale.toLowerCase().startsWith('sv');
  const fileName = isSwedish ? '/quotes.txt' : '/quotes_en.txt';

  const response = await fetch(fileName);
  const text = await response.text();
  return text.split('\n');
};

const HaddockQuotes: React.FC = () => {
  const [quote, setQuote] = useState('');
  const [quotes, setQuotes] = useState<string[]>([]);
  // Fetch quotes from the file and set the initial quote
  useEffect(() => {
    const fetchQuotes = async () => {
      // Check if quotesList is already set, if not, read from file
      if (quotes.length === 0) {
        const quotesList = await readQuotesFromFile();
        setQuotes(quotesList);
        setQuote(quotesList[Math.floor(Math.random() * quotesList.length)]);
      }
    };
    fetchQuotes();
  }, [quotes]);

  // Function to change the quote and image
  const changeQuote = () => {
    const newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(newQuote);
  };

  return (
    <div className="haddock-container">
      <p className="quote-text">{quote}</p>
        <div className="image-container">
          <img
            src={image}
            alt="Captain Haddock"
            onClick={() => {
              changeQuote();
            }}
          />
        </div>

    </div>
  );
};
export default HaddockQuotes;