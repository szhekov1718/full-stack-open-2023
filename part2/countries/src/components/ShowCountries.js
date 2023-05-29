import React, { useState, useEffect } from "react";
import axios from "axios";
import Country from "./Country";

const ShowCountries = ({ filter, handleClick }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all").then((response) => {
      console.log("promise successful");
      setCountries(response.data);
    });
  }, []);

  const countriesToShow =
    filter === ""
      ? countries.filter((country) => country.name === "")
      : countries.filter((country) =>
          country.name.toLowerCase().includes(filter.toLowerCase())
        );
  console.log("search filter:", countriesToShow);

  return (
    <>
      {countriesToShow.length > 10
        ? "Too many matches, specify another filter"
        : countriesToShow.map((country) => (
            <Country
              key={country.name}
              country={country}
              length={countriesToShow.length}
              handleClick={handleClick}
            />
          ))}
    </>
  );
};

export default ShowCountries;
