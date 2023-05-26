const Person = ({ person, deletePerson }) => (
  <div>
    {person.name} {person.number}{" "}
    <button onClick={() => deletePerson(person.id, person.name)}>Delete</button>
  </div>
);

export default Person;
