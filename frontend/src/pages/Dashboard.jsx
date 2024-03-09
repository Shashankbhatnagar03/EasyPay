import { useNavigate } from "react-router-dom";
import Balance from "../components/Balance";
import Appbar from "../components/Appbar";
import User from "../components/User";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../components/Button";

export default function Dashboard() {
  const navigate = useNavigate()
  const [balance, setBalance] = useState(0);

  
  async function fetchBalance(){
    const url = "https://easypay-kr50.onrender.com/api/v1/account/balance";
    const response = await axios.get(url, {
      "headers":{
        "Authorization" : `Bearer ${localStorage.getItem('token')}`
      }
    });
    setBalance(response.data.balance);
  }

  async function addAmount() {
    try {
      const url = "https://easypay-kr50.onrender.com/api/v1/account/add";
      await axios.put(
        url,
        null,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // After adding amount, fetch updated balance
      fetchBalance();
    } catch (error) {
      console.error("Error adding amount:", error);
    }
  }

  useEffect(()=>{
    if (!localStorage.getItem('token')){
      navigate('/');
    }
    fetchBalance();
  },[])
  
  return (
    <div>
      <Appbar/>
      <div className="flex justify-between items-center border-b border-gray-200 py-6 px-6">
  <div className="flex items-center">
    <Balance value={balance} className="text-3xl font-semibold mr-4" />
  </div>

  <div className="flex flex-col justify-center h-ful ">
    <Button
      onClick={addAmount}
      label={"Add ₹100"}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    />
  </div>
</div>
      
      

      <div className="px-6">

      <User/>
      </div>

      </div>
    
  );
}