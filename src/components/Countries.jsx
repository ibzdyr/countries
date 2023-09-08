import React, {useState} from 'react';
import axios from 'axios';

const sortCountriesByName = (countries, order) => countries.sort((a, b) => {
    const nameA = a.name.common.toLowerCase();
    const nameB = b.name.common.toLowerCase();

    if(order==='descend') {
        return nameB < nameA ? -1 : nameB > nameA ? 1 : 0;
    }

    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
})

const filterCountriesByPopulation = (countries, value) => countries.filter(({population})=> population <= value );

const Countries = () => {
    const [filters, setFilters] = useState({
        name: '',
        population: '',
        sort: 'ascend',
        elementsCount: '',
    });

    const [countries, setCountries] = useState(null)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFilters({
            ...filters,
            [name]: value,
        });
    };

    const getCountries = (e) => {
        e.preventDefault();
        axios.get(filters.name ? `https://restcountries.com/v3.1/name/${filters.name}` : 'https://restcountries.com/v3.1/all')
            .then(response => {
                let data = response.data;
                if (filters.sort) {
                   data = sortCountriesByName(data, filters.sort);
                }
                if(filters.population) {
                   data = filterCountriesByPopulation(data, filters.population);
                }
                if (filters.elementsCount) {
                  data =  data.slice(0, filters.elementsCount);
                }
                setCountries(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div>
            <h1>Parameter Form</h1>
            <form onSubmit={getCountries}>
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={filters.name}
                    onChange={handleChange}
                /><br/><br/>

                <label htmlFor="population">Population: </label>
                <input
                    type="number"
                    id="population"
                    name="population"
                    value={filters.population}
                    onChange={handleChange}
                /><br/><br/>

                <label htmlFor="sort">Sort Order: </label>
                <select
                    id="sort"
                    name='sort'
                    value={filters.sort}
                    onChange={handleChange}
                >
                    <option value="ascend">Ascending</option>
                    <option value="descend">Descending</option>
                </select><br/><br/>

                <label htmlFor="elementsCount">Elements Count: </label>
                <input
                    type="number"
                    id="elementsCount"
                    name="elementsCount"
                    value={filters.elementsCount}
                    onChange={handleChange}
                /><br/><br/>

                <button type="submit">Submit</button>

                <h1>Countries</h1>
                {countries && <div className="country-table">
                    <table>
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Region</th>
                            <th>Capital</th>
                            <th>Population</th>
                        </tr>
                        </thead>
                        <tbody>
                        {countries.map((country, index) => (
                            <tr key={index}>
                                <td>{country.name.common}</td>
                                <td>{country.region}</td>
                                <td>{country.capital?.[0]}</td>
                                <td>{country.population}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>}
            </form>
        </div>
    );
}

export default Countries;