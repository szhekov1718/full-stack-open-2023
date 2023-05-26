import Person from "./Person";

const People = ({ filter, persons, deletePerson }) => {
  const personsToShow =
    filter === ""
      ? persons
      : persons.filter(
          (person) =>
            person.name
              .toLowerCase()
              .includes(filter.target.value.toLowerCase()) ||
            person.number
              .toLowerCase()
              .includes(filter.target.value.toLowerCase())
        );

  return (
    <>
      {personsToShow.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </>
  );
};

export default People;
