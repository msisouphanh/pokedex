import { useLocation } from "react-router-dom";
import { type Pokemon } from "../App.tsx"; // or wherever your types live

function PokemonDetails() {
  const location = useLocation();
  const pkm = location.state as Pokemon;
  const multiplier = 0.220462;

  return (
    <>
      <h1>{pkm.name}</h1>
      <p>Weight: {parseFloat((pkm.weight * multiplier).toFixed(1))} lbs</p>
      <p>Types: {pkm.types.map((t) => t.type.name)} </p>
    </>
  );
}

export default PokemonDetails;
