import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Conponents/Login";
import Connected from "./Conponents/Connected";
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setnumber] = useState("");

  useEffect(() => {
    // console.log("first");
    getCandidates();
    getRemainingTime();
    getCurrentStatus();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  });

  async function getCandidates() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    console.log(signer);
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    const candidatesList = await contractInstance.retrieve();
    console.log("YO");
    console.log(candidatesList);
    const formattedCandidates = candidatesList.map((candidate, index) => {
      return {
        index: index,
        name: candidate.candidatesName,
        voteCount: candidate.voteCount.toNumber(),
      };
    });
    setCandidates(formattedCandidates);
  }

  async function getCurrentStatus() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    console.log(contractInstance);
    let status = await contractInstance.getVotingStatus();
    console.log("first");
    console.log(status);
    setVotingStatus(status);
  }

  async function getRemainingTime() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    );
    console.log(contractInstance);
    const remaingsTime = await contractInstance.getRemainingTime();
    console.log("first");
    console.log(remaingsTime);
    setRemainingTime(parseInt(remaingsTime, 16));
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      // canVote();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        console.log("metamask address" + address);
        setIsConnected(true);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Metamask is detected in the browser");
    }
  }
  return (
    <div className="App">
      {isConnected ? (
        <Connected
          account={account}
          candidates={candidates}
          remaingTime={remainingTime}
          number={number}
        />
      ) : (
        <Login connectWallet={connectToMetamask} />
      )}
    </div>
  );
}

export default App;
