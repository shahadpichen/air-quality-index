import { useMap } from "react-map-gl";

export const SearchResult = ({ result, cityCoordinates }) => {
  const { current: map } = useMap();
  let lat;
  let long;

  if (cityCoordinates && cityCoordinates.city === result) {
    lat = cityCoordinates.coordinates[0];
    long = cityCoordinates.coordinates[1];
  }

  return (
    <div
      className="py-2.5 px-5 cursor-pointer hover:bg-gray-200"
      onClick={() =>
        map.flyTo({ center: [lat, long], zoom: 6, duration: 12000 })
      }
    >
      {result}
    </div>
  );
};
