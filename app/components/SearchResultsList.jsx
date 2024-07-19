import { SearchResult } from "./SearchResult";

export const SearchResultsList = ({ results, coordinates }) => {
  return (
    <div className="w-full bg-white flex flex-col shadow-md rounded-xl mt-3 max-h-[300px] overflow-y-auto">
      {results.map((result, id) => {
        const cityCoordinates = coordinates.find(
          (coord) => coord.city === result
        );
        return (
          <SearchResult
            result={result}
            cityCoordinates={cityCoordinates}
            key={id}
          />
        );
      })}
    </div>
  );
};
