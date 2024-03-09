
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Appbar() {
    const navigate = useNavigate();
    const [userFirstName, setUserFirstName] = useState('user');

    const fetchUserData = async () =>{
        const url = "http://localhost:3000/api/v1/user/details";
        const response = await axios.get(url, {
          headers:{
            "Authorization" : `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserFirstName(response.data.firstName);
      }
      useEffect(()=>{
        fetchUserData();
      },[])

    function handleLogout(){
        localStorage.removeItem('token');
        console.log('logged out')
        navigate('/');
      }
    return <div className="shadow h-14 flex justify-between">
        <div className="font-bold text-xl flex flex-col justify-center h-full ml-4">
        <Link to="/">EasyPay</Link>
        </div>
        <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
                Hello, {userFirstName.charAt(0).toUpperCase() + userFirstName.slice(1).toLowerCase()}
            </div>
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                {userFirstName[0].toUpperCase()}
                </div>
            </div>
            <div className="py-2 px-2">

            <button onClick={handleLogout} type="button" className=" w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">Log out</button>
            </div>
        </div>
    </div>
}