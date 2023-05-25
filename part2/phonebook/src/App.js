import { useState, useEffect } from "react";
import axios from "axios";
import Notification from "./components/Notification";
import People from "./components/People";
import Person from "./components/Person";
import Search from "./components/Search";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3002/people")
      .then((response) => response.data)
      .then((response) => setPersons(response));
  }, []);

  const handleFilter = (event) => setSearch(event.target.value);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPerson = {
      name: newName,
    };

    if (persons.includes(newName)) {
      window.alert(`${newName} is already added to phonebook`);
    }

    setPersons(persons.concat(newPerson));
    setNewName("");
  };

  const addName = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name: <input value={newName} onChange={addName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {persons.map((person) => (
        <div>{person.name}</div>
      ))}
    </div>
  );
};

export default App;
