import { Link } from "react-router-dom";
import pokemonLogo from "../assets/images/pokemonlogo.png";

function NavigationBar() {
  return (
    <>
      <div className="w-full mb-8">
        <div className="flex flex-row items-center justify-center max-w-6xl mx-auto">
          <Link to="/">
            <img className="h-[150px]" src={pokemonLogo} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default NavigationBar;
