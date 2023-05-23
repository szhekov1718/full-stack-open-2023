
const Search = ({handleFilter}) => {
    return (
        <form>
            <input placeholder="search" type="text" onChange={(event) => {handleFilter(event);}}/>
        </form>
    )
}

export default Search;