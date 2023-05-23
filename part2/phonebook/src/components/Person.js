
const Person = ({handleSubmit, handleChange}) => {
    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <div>
    
                        <input
                            placeholder="name"
                            name="name"
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        />
    
                        <input
                            placeholder="number"
                            name="number"
                            onChange={(e) => {
                                handleChange(e);
                            }}
                        />
    
                        <button type="submit">add</button>			
            </div>
        </form>
      )
}