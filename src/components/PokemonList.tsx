import { useEffect, useState } from "react";

export interface PokemonSprites {
  front_default: string;
}

export interface Pokemon {
  name: string;
  sprites: PokemonSprites;
}

export interface PokemonInfo {
  id: number;
  name: string;
  url: string;
}

export interface Page {
  count: number;
  next: string;
  previous: string;
  results: PokemonInfo[];
}

function PokemonList() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon/";
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>(initialUrl);

  useEffect(() => {
    fetch(nextUrl)
      .then((res) => res.json())
      .then((data: Page) => {
        const requests = data.results.map((item) =>
          fetch(item.url).then((res) => res.json())
        );
        return Promise.all(requests);
      })
      .then((fullPokemonData) => setPokemon(fullPokemonData));
  }, [nextUrl]);

  // console.log(pokemonData);
  return (
    <>
      {pokemon.map((item) => (
        <div key={item.name}>
          <img src={item.sprites.front_default}></img>
          <p>{item.name}</p>
        </div>
      ))}
      <button>View More</button>
    </>
  );
}

export default PokemonList;
