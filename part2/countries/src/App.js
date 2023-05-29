import React, { useState } from "react";
import ShowCountries from "./components/ShowCountries";

const App = () => {
  const [filter, setFilter] = useState("");

  const handleClick = (event) => setFilter(event.target.id);

  return (
    <>
      <div>
        find countries:{" "}
        <input onChange={({ target }) => setFilter(target.value)} />
      </div>
      <ShowCountries
        filter={filter}
        handleClick={(event) => handleClick(event)}
      />
    </>
  );
};

export default App;
