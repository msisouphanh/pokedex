import { useEffect, useState } from "react";

export interface Pokemon {
  id: number;
  name: string;
}

export interface Page {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

function PokemonList() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const url = "https://pokeapi.co/api/v2/pokemon/";
  const [currentUrl, setUrl] = useState(url);

  useEffect(() => {
    fetch(currentUrl)
      .then((res) => res.json())
      .then((data: Page) => {
        setPokemon((prev) => [...prev, ...data.results]);
      });
  }, [currentUrl]);

  console.log(pokemon);
  return (
    <>
      {pokemon.map((item) => (
        <p>{item.name}</p>
      ))}
    </>
  );
}

export default PokemonList;
