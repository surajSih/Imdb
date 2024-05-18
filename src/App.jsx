import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import "./index.css";

function Card({ fetched }) {
  if (!fetched || !fetched.Search) {
    return <div className="text-center text-gray-500">No data available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {fetched.Search.slice(0, 10).map((item, index) => (
        <div
          key={index}
          className="card bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <img
            className="w-full h-48 object-cover"
            src={item.Poster}
            alt={item.Title}
          />
          <div className="p-4">
            <h3 className="text-lg font-bold">{item.Title}</h3>
            <p className="text-gray-600">{item.Year}</p>
            <div className="flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500" />
              <span className="ml-2">{item.imdbRating || "N/A"}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [movieData, setMovieData] = useState("");
  const [fetched, setFetched] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=cd3cb347&s=${movieData}`
      ).then((data) => data.json());

      // Fetch detailed information for each movie to get the IMDb rating
      const detailedResults = await Promise.all(
        response.Search.map(async (movie) => {
          const movieDetails = await fetch(
            `https://www.omdbapi.com/?apikey=cd3cb347&i=${movie.imdbID}`
          ).then((data) => data.json());
          return { ...movie, imdbRating: movieDetails.imdbRating };
        })
      );

      setFetched({ Search: detailedResults });
      setMovieData("");
    } catch (error) {
      console.error("An error occurred: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold text-center mb-4">
        Search for a Movie
      </h2>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Enter Name..."
          value={movieData}
          onChange={(e) => setMovieData(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-64 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={fetchData}
          className="ml-2 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 focus:outline-none"
        >
          Search
        </button>
      </div>
      <Card fetched={fetched} />
    </div>
  );
}
