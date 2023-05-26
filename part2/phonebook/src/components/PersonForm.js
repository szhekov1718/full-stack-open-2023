const PersonForm = ({
  addPerson,
  newName,
  setNewName,
  newNumber,
  setNewNumber,
}) => (
  <form onSubmit={addPerson}>
    <div>
      Name:{" "}
      <input
        placeholder="name"
        value={newName}
        onChange={({ target }) => setNewName(target.value)}
      />
    </div>
    <div>
      Number:{" "}
      <input
        placeholder="number"
        value={newNumber}
        onChange={({ target }) => setNewNumber(target.value)}
      />
    </div>
    <button type="submit">Add</button>
  </form>
);

export default PersonForm;
