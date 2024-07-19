import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import heatData from "../data/worldaqi.json";

export const SearchBar = ({ setResults, setInput }) => {
  const [input, setLocalInput] = useState("");

  const cityData = heatData.features
    .map((data) => {
      const city = data.properties.city;
      const coordinates = data.geometry && data.geometry.coordinates;

      return city !== null && coordinates ? { city, coordinates } : null;
    })
    .filter((item) => item !== null);

  const handleChange = (value) => {
    setLocalInput(value);
    setInput(value);

    if (value.trim() !== "") {
      const filteredResults = cityData.filter((city) =>
        city.city.toLowerCase().includes(value.toLowerCase())
      );

      const uniqueCities = new Set();
      const uniqueResults = [];

      filteredResults.forEach((city) => {
        if (!uniqueCities.has(city.city.toLowerCase())) {
          uniqueCities.add(city.city.toLowerCase());
          uniqueResults.push(city);
        }
      });

      setResults(uniqueResults);
    } else {
      setResults([]);
    }
  };

  return (
    <div className="w-full h-10 border-none rounded-xl px-4 shadow-md bg-white flex items-center">
      <FaSearch />
      <input
        placeholder="Search city..."
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent border-none h-full text-base w-full ml-2 focus:outline-none"
      />
    </div>
  );
};
