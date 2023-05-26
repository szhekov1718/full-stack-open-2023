import { useState, useEffect } from "react";
import Notification from "./components/Notification";
import People from "./components/People";
import Search from "./components/Search";
import PersonForm from "./components/PersonForm";
import peopleService from "./services/people";

const App = () => {
  const [people, setPeople] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationType, setNotificationType] = useState("");

  useEffect(() => {
    peopleService.getAll().then((initialPeople) => {
      setPeople(initialPeople);
    });
  }, []);

  const addNewPerson = (event) => {
    event.preventDefault();

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    const personExists = people.find((person) => person.name === newName);

    if (personExists) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook. Do you want to change their number?`
        )
      ) {
        peopleService
          .update(personExists.id, newPerson)
          .then((createdPerson) => {
            setPeople(
              people.map((person) =>
                person.id !== createdPerson.id ? person : createdPerson
              )
            );
            setErrorMessage(`${personExists.name}'s number was updated`);
            setNotificationType("success");
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${personExists.name} has already been removed from server`
            );
            setNotificationType("error");
            setPeople(people.filter((p) => p.id !== personExists.id));
          });

        setTimeout(() => setErrorMessage(null), 4000);
      } else {
        setNewName("");
        setNewNumber("");
      }
    } else {
      peopleService
        .create(newPerson)
        .then((createdPerson) => {
          setPeople(people.concat(createdPerson));
          setErrorMessage(
            `Added ${createdPerson.name} with number ${createdPerson.number}`
          );
          setNotificationType("success");
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          setErrorMessage(`${error.response.data.error}`);
          setNotificationType("error");
        });

      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleDeletePerson = (id) => {
    const person = people.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name} with number ${person.number}?`))
      peopleService
        .deletePerson(id)
        .then(() => {
          peopleService.getAll().then((people) => setPeople(people));
          setErrorMessage(
            `Deleted ${person.name} with number ${person.number}`
          );
          setNotificationType("success");
        })
        .catch((error) => {
          setErrorMessage(`${error.response.data.error}`);
          setNotificationType("error");
        });

    setTimeout(() => setErrorMessage(null), 4000);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type={notificationType} />
      <Search handleFilter={setSearch} />
      <h3>Add new person and number </h3>
      <PersonForm
        addPerson={addNewPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <h3>Phone Numbers</h3>
      <People
        filter={search}
        persons={people}
        deletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
