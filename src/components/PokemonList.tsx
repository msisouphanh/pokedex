import { useEffect, useState } from "react";
export interface PokemonData {
  name: string;
}
export interface Pokemon {
  id: number;
  name: string;
  url: string;
}

export interface Page {
  count: number;
  next: string;
  previous: string;
  results: Pokemon[];
}

function PokemonList() {
  const initialUrl = "https://pokeapi.co/api/v2/pokemon/";
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [nextUrl, setNextUrl] = useState<string>(initialUrl);

  useEffect(() => {
    fetch(nextUrl)
      .then((res) => res.json())
      .then((data: Page) => {
        data.results.forEach((item) =>
          fetch(item.url)
            .then((res) => res.json())
            .then((pokemon) => {
              setPokemonData((prev) => [...prev, pokemon]);
            })
        );
      });
  }, [nextUrl]);

  console.log(pokemonData);

  // console.log(pokemonData);
  return (
    <>
      {/* {pokemon.map((item) => (
        <p>
          {item.name} {item.url}
        </p>
      ))} */}
    </>
  );
}

export default PokemonList;
