"use client";

import { useState, useEffect } from "react";
import Map, { Marker, Popup, useMap } from "react-map-gl";
import { v4 as uuidv4 } from "uuid";
import heatMap from "./data/data.json";
import "./mapbox-gl.css";

//To get the entire data , uncomment the code and map data intead of heatMap

// export const fetchData = async () => {
//   try {
//     const response = await fetch(
//       "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/openaq/exports/geojson?lang=en&timezone=Asia%2FKolkata"
//     );
//     const result = await response.json();
//     return {
//       props: { data: result.features },
//     };
//   } catch (err) {
//     console.log(err);
//   }
// };

export function NavigateButton() {
  const { current: map } = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (map) {
        map.flyTo({ center: [54.3773, 24.4539], zoom: 10 });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}
export default function Home({ data }) {
  const [viewport, setViewPort] = useState({
    longitude: -122.4,
    latitude: 37.8,
    zoom: 2,
  });

  const [darkMode, setDarkMode] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(!isChecked);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const [selectedLoc, setSelectLoc] = useState(null);
  const isAirQualitySafe = (parameter, value, unit) => {
    if (parameter === "CO" && value <= 9000 && unit === "µg/m³") {
      return true;
    } else if (parameter === "NO2" && value <= 21 && unit === "µg/m³") {
      return true;
    } else if (parameter === "SO2" && value <= 150 && unit === "µg/m³") {
      return true;
    } else if (parameter === "O3" && value <= 120 && unit === "µg/m³") {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div>
      <Map
        {...viewport}
        onMove={(evt) => setViewPort(evt.viewport)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle={
          darkMode === false
            ? `mapbox://styles/mapbox/streets-v12`
            : "mapbox://styles/mapbox/dark-v11"
        }
        projection="globe"
      >
        <NavigateButton />
        <h1 className="fixed text-4xl text-white text-semibold top-[3vh] left-5">
          World Air Quality Index
        </h1>
        <h2 className="fixed text-base text-white top-[8vh] left-5">
          Calculated using various air pollutant concentrations
        </h2>
        <h2 className="fixed text-xs text-white bottom-[3vh] right-5">
          Source:-{" "}
          <a
            href="https://public.opendatasoft.com/explore/dataset/openaq/information/"
            className="hover:text-sky-700"
          >
            opendatasoft
          </a>
        </h2>

        <div className="fixed top-[2vh] right-2">
          <div className="flex flex-col items-center p-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={handleChange}
                onClick={toggleTheme}
                className="sr-only"
              />
              <div
                className={`w-14 h-8 bg-gray-300 rounded-full flex items-center transition-colors ${
                  isChecked ? "bg-blue-500" : ""
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                    isChecked ? "translate-x-8" : ""
                  }`}
                ></div>
              </div>
            </label>
          </div>
        </div>

        {heatMap.features?.map((heat) => {
          const [longitude, latitude] = heat.geometry?.coordinates || [];

          // Ensure latitude and longitude are valid numbers
          if (typeof latitude === "number" && typeof longitude === "number") {
            return (
              <Marker key={uuidv4()} latitude={latitude} longitude={longitude}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectLoc(heat);
                  }}
                >
                  {isAirQualitySafe(
                    heat.properties?.measurements_parameter,
                    heat.properties?.measurements_value,
                    heat.properties?.measurements_unit
                  ) ? (
                    <img src="/icon.svg" width="30px" alt="Marker icon" />
                  ) : (
                    <img src="/icon2.svg" width="30px" alt="Marker icon" />
                  )}
                </button>
              </Marker>
            );
          }
        })}

        {selectedLoc && (
          <Popup
            longitude={selectedLoc.geometry?.coordinates[0]}
            latitude={selectedLoc.geometry?.coordinates[1]}
            closeButton={true}
            onClose={() => {
              setSelectLoc(null);
            }}
            closeOnClick={false}
            offsetTop={-30}
          >
            <div className="text-cyan-800 p-2">
              <h1 className="text-lg font-semibold leading-tight">
                {selectedLoc.properties?.location}
              </h1>
              <p>
                {new Date(
                  selectedLoc.properties?.measurements_lastupdated
                ).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: true,
                })}
              </p>
              <h2 className="pt-2 text-sm flex gap-1">
                <img src="/air.svg" className="" width="17px" alt="Air icon" />
                {selectedLoc.properties?.measurements_parameter} :{" "}
                {selectedLoc.properties?.measurements_value}{" "}
                {selectedLoc.properties?.measurements_unit}
              </h2>
              {isAirQualitySafe(
                selectedLoc.properties?.measurements_parameter,
                selectedLoc.properties?.measurements_value,
                selectedLoc.properties?.measurements_unit
              ) ? (
                <p className="text-green-600">Air quality is safe.</p>
              ) : (
                <p className="text-red-600">Air quality is not safe.</p>
              )}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
