/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { MIGRATION_ADDR, IXP_V3_ADDR } from "../abis/address";
import Erc20ABI from "../abis/ERC20ABI.json";
import MigrationABI from "../abis/Migration.json";
import { multicall, RPC_ENDPOINT } from "../utils/contracts";
import { useAddress } from "./web3Context";

const defaultVal = {
  allowance: false,
  balance: "0",
  decimals: 18,
  migratedAmount: "0",
  pendingClaim: "0",
  claimable: false,
  fetchAccountMigrationData: () => {},
  fetchTxList: () => {},
};

export const MigrationInfoContext = React.createContext(defaultVal);

export default function useMigrationInfo() {
  return React.useContext(MigrationInfoContext);
}

export function MigrationInfoProvider({ children }) {
  const account = useAddress();

  const [allowance, setAllowance] = useState(false);
  const [balance, setBalance] = useState(ethers.constants.Zero);
  const [migratedAmount, setMigratedAmount] = useState(ethers.constants.Zero);
  const [pendingClaim, setPendingClaim] = useState(ethers.constants.Zero);
  const [claimable, setClaimable] = useState(false);
  const [decimals, setDecimals] = useState(18);
  const [histories, setHistories] = useState([]);

  const fetchAccountMigrationData = async () => {
    try {
      let calls = [
        {
          address: MIGRATION_ADDR,
          name: "pendingClaim",
          params: [account],
        },
        {
          address: MIGRATION_ADDR,
          name: "userInfo",
          params: [account],
        },
        {
          address: MIGRATION_ADDR,
          name: "claimable",
        },
      ];
      multicall(MigrationABI, calls).then((data) => {
        setMigratedAmount(data[1].amount);
        setPendingClaim(data[0][0]);
        setClaimable(data[2][0]);
      });
      calls = [
        {
          address: IXP_V3_ADDR,
          name: "balanceOf",
          params: [account],
        },
        {
          address: IXP_V3_ADDR,
          name: "allowance",
          params: [account, MIGRATION_ADDR],
        },
        {
          address: IXP_V3_ADDR,
          name: "decimals",
        },
      ];
      multicall(Erc20ABI, calls).then((data) => {
        setBalance(data[0][0]);
        setAllowance(data[1][0] >= ethers.utils.parseEther("10000"));
        setDecimals(data[2][0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTxList = async () => {
    const provider = new ethers.providers.JsonRpcProvider(RPC_ENDPOINT[1]);
    try {
      const response = await axios.get(
        `https://api.etherscan.io/api?module=account&action=txlist&address=${account}&page=1&offset=1000&sort=desc&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX`
      );

      let txList = response.data.result;
      txList = txList.filter((tx) => tx.to === MIGRATION_ADDR.toLowerCase());

      const tmpList = []
      const interf = new ethers.utils.Interface(MigrationABI);
      for (let i = 0; i < txList.length; i++) {
        const tx = await provider.getTransactionReceipt(txList[i].hash);
        for (let j = 0; j < tx.logs.length; j++) {
          const log = tx.logs[j];
          if (log.address.toLowerCase() === MIGRATION_ADDR.toLowerCase()) {
            const data = interf.parseLog(log);
            if (data.name !== "Claim" && data.name !== "Deposit") continue;

            txList[i].name = data.name === "Deposit" ? "Migrate" : "Claim";
            txList[i].amount = data.args.amount;
          }
        }
        if(txList[i].amount) tmpList.push(txList[i])
      }
      setHistories(tmpList);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    setAllowance(false);
    setBalance(ethers.constants.Zero);
    setMigratedAmount(ethers.constants.Zero);
    setPendingClaim(ethers.constants.Zero);
    setHistories([]);

    if (account) {
      fetchAccountMigrationData();
      fetchTxList();
    }
  }, [account]);

  return (
    <MigrationInfoContext.Provider
      value={{
        allowance,
        balance,
        migratedAmount,
        pendingClaim,
        decimals,
        claimable,
        histories,
        fetchAccountMigrationData,
        fetchTxList,
      }}
      children={children}
    />
  );
}
