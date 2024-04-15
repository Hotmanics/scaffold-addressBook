"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  const { writeAsync: add } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "add",
    args: ["0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf", "Web3 Testing Account"],
  });

  // const { writeAsync: remove } = useScaffoldContractWrite({
  //   contractName: "YourContract",
  //   functionName: "remove",
  //   args: ["0x3bEc6a181d6Ef7239F699DAf2fAa5FE3A5f01Edf"],
  // });

  const { writeAsync: removeByIndex } = useScaffoldContractWrite({
    contractName: "YourContract",
    functionName: "removeByIndex",
    args: [BigInt(0)],
  });

  const connectedAccount = useAccount();

  const { data } = useScaffoldContractRead({
    contractName: "YourContract",
    functionName: "getAll",
    args: [connectedAccount.address],
  });
  // const { data: sizeOf } = useScaffoldContractRead({
  //   contractName: "YourContract",
  //   functionName: "getSizeOf",
  //   args: [connectedAccount.address],
  // });

  console.log(data);

  const allAddresses = data?.map((entry, index) => {
    return (
      <div key={index} className="flex flex-col bg-secondary items-center justify-center m-1">
        <p>{entry.baseStructure.displayName}</p> <Address address={entry.baseStructure.contact} />
        <p>Node Index: {entry.nodeIndex.toString()}</p>
        <button
          onClick={async () => {
            await removeByIndex({ args: [entry.nodeIndex] });
          }}
        >
          X
        </button>
      </div>
    );
  });

  // console.log(sizeOf);
  console.log(data);

  async function onSubmit(event: any) {
    event.preventDefault();
    const target = event.target;
    console.log(target.inputName.value);
    console.log(target.inputAddress.value);

    await add({ args: [target.inputAddress.value, target.inputName.value] });
  }

  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">Scaffold-ETH 2</span>
          </h1>
          <div className="flex justify-center items-center space-x-2">
            <p className="my-2 font-medium">Connected Address:</p>
            <Address address={connectedAddress} />
          </div>

          <form onSubmit={onSubmit} className="flex flex-col p-2 m-2">
            <p className="text-center grilledCheese text-4xl">New Entry</p>
            <div className="flex flex-col items-center justify-center">
              <label>Name</label>
              <input name="inputName" className="m-1 p-2 bg-white text-black font-mono botder-2 border-black"></input>
              <label>Address</label>
              <input
                name="inputAddress"
                className="m-1 p-2 bg-white text-black font-mono botder-2 border-black"
              ></input>
            </div>
            <button type="submit" className="btn btn-secondary m-1">
              Add
            </button>
          </form>
          {/* 
          <button
            onClick={async () => {
              await writeAsync();
            }}
          >
            Add
          </button> */}

          {allAddresses}
          <p className="text-center text-lg">
            Get started by editing{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/nextjs/app/page.tsx
            </code>
          </p>
          <p className="text-center text-lg">
            Edit your smart contract{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              YourContract.sol
            </code>{" "}
            in{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              packages/hardhat/contracts
            </code>
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <BugAntIcon className="h-8 w-8 fill-secondary" />
              <p>
                Tinker with your smart contract using the{" "}
                <Link href="/debug" passHref className="link">
                  Debug Contracts
                </Link>{" "}
                tab.
              </p>
            </div>
            <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
              <MagnifyingGlassIcon className="h-8 w-8 fill-secondary" />
              <p>
                Explore your local transactions with the{" "}
                <Link href="/blockexplorer" passHref className="link">
                  Block Explorer
                </Link>{" "}
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
