import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom" 
import { useNavigate } from "react-router-dom";

export const SendMoney = () => {

    const [searchParams] = useSearchParams();
    const id =searchParams.get("id");
    const name = searchParams.get("name");
    const [amount , setAmount] = useState(0);
    const [paymentCompleted, setPaymentCompleted] = useState(false);
    const [transferFail, setTranferFail] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
          navigate("/");
        }
      }, []);

    useEffect(() => {
        if (paymentCompleted) {
            const timer = setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [paymentCompleted, navigate]);

    const initiateTransfer = async () => {
        try {
            const response = await axios.post("https://easypay-kr50.onrender.com/api/v1/account/transfer", {
                to: id,
                amount
            }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            });
    
            // Payment completed successfully
            setPaymentCompleted(true);
            setTranferFail(false);
            
        } catch (error) {
            // Handle error if payment fails
            console.error("Payment failed:", error);
            setTranferFail(true);
            setPaymentCompleted(false);
        }
    };

    return <div className="flex justify-center h-screen bg-gray-100">
        <div className="h-full flex flex-col justify-center">
            <div
                className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg"
            >
                <div className="flex flex-col space-y-1.5 p-6">
                <h2 className="text-3xl font-bold text-center">Send Money</h2>
                </div>
                <div className="p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
                    </div>
                    <h3 className="text-2xl font-semibold">{name}</h3>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="amount"
                    >
                        Amount (in Rs)
                    </label>
                    <input
                        onChange={(e)=>{
                            setAmount(e.target.value);
                        }}
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        id="amount"
                        placeholder="Enter amount"
                    />
                    </div>
                    <button onClick={initiateTransfer}
                     className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white">
                        Initiate Transfer
                    </button>

                    {paymentCompleted && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">Payment completed successfully</div>}
                    {transferFail && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">Enter a Valid Amount!</div>}
                    
                    
                </div>
                </div>
        </div>
      </div>
    </div>
}