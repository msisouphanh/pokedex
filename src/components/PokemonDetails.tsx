import { Await, useLocation } from "react-router-dom";
import { type Pokemon } from "../App.tsx";
import { useEffect } from "react";

// export interface chain {

// }

function PokemonDetails() {
  const location = useLocation();
  const pkm = location.state as Pokemon;
  const multiplier = 0.220462;

  // console.log(pkm);

  useEffect(() => {
    async function load() {
      const speciesRes = await fetch(pkm.species.url);
      const speciesData = await speciesRes.json();
      // console.log(speciesData.evolution_chain.url);
      const evolutionRes = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionRes.json();

      // const thirdEvolution =
      //   evolutionData.chain.evolves_to[0].evolves_to[0].species.name;
      // const secondEvolution = evolutionData.chain.evolves_to[0].species.name;
      // const firstEvolution = evolutionData.chain.species.name;

      function collectEvolutionNames(node, result = []) {
        for (const child of node.evolves_to) {
          result.push(child.species.name);
          collectEvolutionNames(child, result);
        }

        return result;
      }
      // console.log(evolutionData);
      console.log(collectEvolutionNames(evolutionData.chain));
      // console.log(evolutionData.chain.evolves_to[0].evolves_to[0].species.name);
      // console.log(evolutionData.chain.evolves_to[0].species.name);
      // console.log(evolutionData.chain.species.name);
    }
    load();
  }, []);

  return (
    <>
      <h1>{pkm.name}</h1>
      <p>Weight: {parseFloat((pkm.weight * multiplier).toFixed(1))} lbs</p>
      <p>Types: {pkm.types.map((p) => p.type.name)} </p>
    </>
  );
}

export default PokemonDetails;
