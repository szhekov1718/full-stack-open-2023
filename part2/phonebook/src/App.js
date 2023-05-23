import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [search, setSearch] = useState('')

  const handleFilter = (event) => setSearch(event.target.value)

  const handleSubmit = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName
    }

    if (persons.includes(newName)){
      window.alert(`${newName} is already added to phonebook`)
    }

    setPersons(persons.concat(newPerson))
    setNewName('')
  }

  const addName = (event) => {
      setNewName(event.target.value)
    }

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
      {persons.map(person => 
        <div>{person.name}</div>
        )}
    </div>
  )
}

export default App