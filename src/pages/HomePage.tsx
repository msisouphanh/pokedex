import PokemonList from "../components/PokemonList";
import { type Pokemon } from "../App.tsx";
import NavigationBar from "../components/NavigationBar.tsx";

interface Props {
  pokemon: Pokemon[];
  onLoadMore: () => void;
}

function HomePage({ pokemon, onLoadMore }: Props) {
  return (
    <>
      <NavigationBar />
      <PokemonList pokemon={pokemon} onLoadMore={onLoadMore} />
    </>
  );
}

export default HomePage;
