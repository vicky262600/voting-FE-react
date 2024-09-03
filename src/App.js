import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Conponents/Login";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>
        <Login />
      </h1>
    </div>
  );
}

export default App;
