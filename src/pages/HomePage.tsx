import PokemonList from "../components/PokemonList";
import { type Pokemon } from "../App.tsx";

interface Props {
  pokemon: Pokemon[];
  onLoadMore: () => void;
}

function HomePage({ pokemon, onLoadMore }: Props) {
  return (
    <>
      <PokemonList pokemon={pokemon} onLoadMore={onLoadMore} />
    </>
  );
}

export default HomePage;
