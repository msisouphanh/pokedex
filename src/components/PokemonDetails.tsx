import { useLocation } from "react-router-dom";
import { type Pokemon } from "../App.tsx";
import { useState, useEffect } from "react";

interface Chain {
  species: {
    name: string;
  };
  evolves_to: Chain[];
}

function PokemonDetails() {
  const location = useLocation();
  const pkm = location.state as Pokemon;
  const multiplier = 0.220462;

  const [evoPokemon, setEvoPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    async function load() {
      const speciesRes = await fetch(pkm.species.url);
      const speciesData = await speciesRes.json();

      const evolutionRes = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionRes.json();
      console.log(evolutionData);

      function getPkmEvoNames(node: Chain, result: string[] = []) {
        result.push(node.species.name);
        for (const child of node.evolves_to) {
          // console.log(child)
          getPkmEvoNames(child, result);
        }

        return result;
      }

      // console.log(evolutionData.chain.evolves_to[0].evolves_to[0].species.name);
      // console.log(evolutionData.chain.evolves_to[0].species.name);
      // console.log(evolutionData.chain.species.name);
      const pkmEvoNames = getPkmEvoNames(evolutionData.chain);
      const pkmEvoUrls = pkmEvoNames.map(
        (pkmEndUrl) => `https://pokeapi.co/api/v2/pokemon/${pkmEndUrl}`
      );
      const evoPokemons: Pokemon[] = [];

      for (const pkmUrl of pkmEvoUrls) {
        const res = await fetch(pkmUrl);
        const data: Pokemon = await res.json();

        evoPokemons.push(data);

        setEvoPokemon([...evoPokemons]);
      }
      // const requests = pkmEvoUrls.map((url) =>
      //   fetch(url).then((res) => res.json())
      // );

      // const fullEvoPokemonData = await Promise.all(requests);

      // setEvoPokemon((prev) => {
      //   const map = new Map(prev.map((p) => [p.name, p]));
      //   fullEvoPokemonData.forEach((p) => map.set(p.name, p));
      //   return [...map.values()];
      // });
    }
    load();
  }, []);

  return (
    <>
      <h1>{pkm.name}</h1>
      <p>Weight: {parseFloat((pkm.weight * multiplier).toFixed(1))} lbs</p>
      <p>Types: {pkm.types.map((p) => p.type.name)} </p>
      {evoPokemon.map((p) => (
        <img src={p.sprites.front_default} />
      ))}
    </>
  );
}

export default PokemonDetails;
