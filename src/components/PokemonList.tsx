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
  const [pageUrl, setPageUrl] = useState<string | null>();

  // useEffect(() => {
  //   fetch(nextUrl)
  //     .then((res) => res.json())
  //     .then((data: Page) => {
  //       x = data.next;
  //       const requests = data.results.map((item) =>
  //         fetch(item.url).then((res) => res.json())
  //       );
  //       return Promise.all(requests);
  //     })
  //     .then((fullPokemonData) => setPokemon(fullPokemonData));
  // }, [nextUrl]);

  useEffect(() => {
    async function load() {
      const res = await fetch(nextUrl);
      const data: Page = await res.json();

      setNextUrl(data.next);
      const request = data.results.map((item) =>
        fetch(item.url).then((res) => res.json())
      );

      const fullPokemonData = await Promise.all(request);

      setPokemon((prev) => {
        const map = new Map(prev.map((p) => [p.name, p]));
        fullPokemonData.forEach((p) => map.set(p.name, p));
        return [...map.values()];
      });
    }

    load();
  }, [pageUrl]);

  const changeUrl = () => {
    if (nextUrl) {
      setPageUrl(nextUrl);
    }
  };

  return (
    <>
      <div className="grid grid-cols-5">
        {pokemon.map((item) => (
          <figure
            key={item.name}
            className="flex flex-col justify-center items-center"
          >
            <img src={item.sprites.front_default}></img>
            <figcaption>{item.name}</figcaption>
          </figure>
        ))}
      </div>
      <button onClick={changeUrl}>view more</button>
    </>
  );
}

export default PokemonList;
