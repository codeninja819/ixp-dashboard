/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAddress } from "./web3Context";
import { getPairContract, getTokenContract, multicall } from '../utils/contracts';
import MultiCallABI from '../abis/MultiCallABI.json'
import { BUYBACK_ADDR, IXP_ADDR, MULTICALL_ADDR } from '../abis/address';
import axios from 'axios';

const defaultVal = {
    price: 0,
    balance: 0,
    marketcap: 0,
    dailyvolume: 0,
    dump: 0,
    recentBuyBack: 0,
    treasuryBalance: 0,
    treasuryValue: 0,
    fetchPrice: () => { },
    fetchBalance: () => { },
    fetchData: () => { }
}

export const TokenInfoContext = React.createContext(defaultVal)

export default function useTokenInfo() {
    return React.useContext(TokenInfoContext);
}
let timerid = null, dataid = null, priceid = null;

const apiKeyList = [
    '77d80f7e-0d2b-42cd-9f63-a7d4f71a859e',
    '4b70f4d7-6eb9-4137-95ce-669c8c62a1a6',
    '653af6ae-de63-4c57-afae-102fa235f270',
    'ee4b00b7-82a3-4455-8686-bb37f06c3f09',
    'b31ca43f-19b9-4e8a-a8ea-4631a5c5d00e',
    'ebfc5d08-7624-477f-be26-38f16aedd021',
    '8e4bde20-fa5d-420c-99c7-f9889609b7a9',
    '7d9b1d81-0df1-415b-be2c-6711818beb8a',
    'f76f0be5-e1de-48c1-83cc-fa2e1e1d03e0',
    '9e6e259c-dbd5-4fe9-9cfd-42437b9ef77b'
];

export function TokenInfoProvider({ children }) {

    const account = useAddress();
    const [price, setPrice] = useState(0);
    const [balance, setBalance] = useState(0);
    const [marketcap, setMarketCap] = useState(0);
    const [dailyvolume, setDailyVolume] = useState(0);
    const [prevbalance, setPrevBalance] = useState(0);
    const [prevprice, setPrevPrice] = useState(0);
    const [ethPrice, setETHPrice] = useState(0);
    const [treasuryBalance, setTreasuryBalance] = useState(0);
    const [recentBuyBack, setRecentBuyBack] = useState(0);

    async function fetchETHPrice() {
        let result = await axios.get(
          "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX"
        );
        const _ethPrice = result.data.result.ethusd;
        const pairContract = getPairContract();
        const reserves = await pairContract.getReserves();
        const price = (reserves[1] * Number(_ethPrice)) / reserves[0];
        return { price: price ? price : 0, ethPrice: _ethPrice };
    }

    async function fetchPrice() {
        try {
            let i;
            for (i = 0; i < apiKeyList.length; i++) {
                const response = await fetch(new Request("https://api.livecoinwatch.com/coins/single"), {
                    method: "POST",
                    headers: new Headers({
                        "content-type": "application/json",
                        "x-api-key": apiKeyList[i],
                    }),
                    body: JSON.stringify({
                        currency: "USD",
                        code: "IMPACTXP",
                        meta: true,
                    }),
                });
                const result = await response.json();
                if (!result.rate)
                    continue;
                setPrice(result.rate);
                setDailyVolume(result.volume);
                setMarketCap(result.rate * result.totalSupply);
                const _prevprice = result.rate - result.rate * (result.delta.day - 1);
                setPrevPrice(_prevprice);
                break;
            }
            console.log(i);
            if (i === apiKeyList.length) {
                setPrice(0);
                setDailyVolume(0);
                setMarketCap(0);
                setPrevPrice(0);
            }
        }
        catch (error) {

        }
    }

    async function fetchData() {
        try {
            const calls = [{
                name: 'getEthBalance',
                address: MULTICALL_ADDR,
                params: [BUYBACK_ADDR]
            }]
            multicall(MultiCallABI, calls).then(data => {
                setTreasuryBalance(data[0][0] / Math.pow(10, 18));
            }).catch(error => console.log(error));

            axios.get(
                "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX"
            ).then(result => {
                const _ethPrice = result.data.result.ethusd;
                setETHPrice(_ethPrice);
            }).catch(error => console.log(error));

            axios.get(
                `https://api.etherscan.io/api?module=account&action=tokentx&address=${BUYBACK_ADDR}&contractaddress=${IXP_ADDR}&page=1&offset=1000&sort=desc&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX`
            ).then(result => {
                const _recentBuyBack = result.data.result[0].value;
                setRecentBuyBack(_recentBuyBack / Math.pow(10, 18));
            }).catch(error => console.log(error));
        }
        catch (error) {
            console.log(error);
        }
    }

    async function fetchBalance() {
        try {
            const tokenContract = getTokenContract();
            const result = await tokenContract.balanceOf(account);
            setBalance(result);
            let txlist = await axios.get(`https://api.etherscan.io/api?module=account&action=tokentx&address=${account}&contractaddress=${IXP_ADDR}&page=1&offset=1000&sort=desc&apikey=47I5RB52NG9GZ95TEA38EXNKCAT4DMV5RX`);
            txlist = txlist.data.result;

            const balance = result / Math.pow(10, 18);
            let time = Date.now() / 1000 - 24 * 3600, prevbalance = balance;
            for (let i = txlist.length - 1; i >= 0; i--) {
                if (txlist[i].timeStamp >= time) {
                    if (txlist[i].from.toLowerCase() === account.toLowerCase()) {
                        prevbalance += txlist[i].value / Math.pow(10, 18);
                    }
                    if (txlist[i].to.toLowerCase() === account.toLowerCase()) {
                        prevbalance -= txlist[i].value / Math.pow(10, 18);
                    }
                }
            }
            setPrevBalance(prevbalance);
            console.log(prevbalance);
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPrice();
        if (priceid) clearInterval(priceid);
        priceid = setInterval(() => {
            fetchPrice()
        }, 60000);
    }, [])

    // useEffect(() => {
    //     fetchData();
    //     if (dataid) clearInterval(dataid);
    //     dataid = setInterval(() => {
    //         fetchData()
    //     }, 20000);
    // }, [])
    // useEffect(() => {
    //     if (!account) return;
    //     fetchBalance();
    //     if (timerid) clearInterval(timerid);
    //     timerid = setInterval(() => {
    //         fetchBalance()
    //     }, 20000);
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [account])

    return <TokenInfoContext.Provider
        value={{
            price,
            ethPrice,
            balance,
            marketcap,
            dailyvolume,
            treasuryBalance,
            treasuryValue: ethPrice * treasuryBalance,
            recentBuyBack: recentBuyBack * price,
            dump: ((balance / 1 || prevbalance / 1) && price) ? ((balance / Math.pow(10, 18) * price - prevbalance * prevprice) / ((balance / 1 ? balance : 0.0001) / Math.pow(10, 18) * price) * 100) : 0,
            fetchPrice,
            fetchBalance,
            fetchData
        }}
        children={children} />;
}