import { useLocation } from "react-router-dom";

function PokemonDetails() {
  const location = useLocation();
  const pkm = location.state;
  return (
    <>
      <h1>{pkm.name}</h1>
    </>
  );
}

export default PokemonDetails;
