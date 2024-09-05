import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Conponents/Login";
import "./App.css";
import { useState } from "react";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = await ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccount", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("metamask is connect" + address);
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className="App">
      <h1>
        <Login />
      </h1>
    </div>
  );
}

export default App;
