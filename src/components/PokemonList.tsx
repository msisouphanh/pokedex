import { useEffect, useState } from "react";

function PokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon/";
  const [currentUrl, setUrl] = useState(url);

  useEffect(() => {
    fetch(currentUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  }, [currentUrl]);

  return (
    <>
      {/* {currentData.map((item) => (
        <p>{item.results.name}</p>
      ))} */}
    </>
  );
}

export default PokemonList;
