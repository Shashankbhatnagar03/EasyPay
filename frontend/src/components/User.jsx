import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Users  () {
    
    const [users, setUsers] = useState([]);
    const [filter,setFilter] = useState("");
    const [userId, setuserId] = useState('user');
    const navigate = useNavigate()
    const fetchUserData = async () =>{
        const url = "https://easypay-kr50.onrender.com/api/v1/user/details";
        const response = await axios.get(url, {
          headers:{
            "Authorization" : `Bearer ${localStorage.getItem('token')}`
          }
        });
        setuserId(response.data._id);
      }

      useEffect(()=>{
        if (!localStorage.getItem('token')){
          navigate('/');
        }
        fetchUserData();
      },[])

    useEffect(()=>{
        const getData = setTimeout(()=>{
            axios.get("https://easypay-kr50.onrender.com/api/v1/user/bulk?filter="+filter)
            .then(response =>{
            setUsers(response.data.user);
            })
        },500) 

        return () => clearTimeout(getData)
    },[filter])

    return <>
        <div className="font-bold mt-6 text-lg">
            Users
        </div>
        <div className="my-2">
            <input onChange={(e)=>{
                setFilter(e.target.value)
            }} type="text" placeholder="Search users..." className="w-full px-2 py-1 border rounded border-slate-200"></input>
        </div>
        <div className="user">
        {users.map(user => {
    if (userId !== user._id) {
        return <User user={user} />;
    }
    return null; // Return null to skip rendering this user
})}
        </div>
    </>
}

function User({user}) {
    const navigate = useNavigate();
    return <div  className="flex justify-between">
        <div className="flex">
            <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
                <div className="flex flex-col justify-center h-full text-xl">
                    {user.firstName[0]}
                </div>
            </div>
            <div className="flex flex-col justify-center h-ful">
                <div>
                    {user.firstName} {user.lastName}
                </div>
            </div>
        </div>

        <div className="flex flex-col justify-center h-ful">
            <Button onClick={()=>{
                navigate("/send?id="+ user._id +"&name="+user.firstName);
            }} label={"Send Money"} />
        </div>
    </div>
}