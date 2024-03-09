import {  useEffect, useState } from "react"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios";
import { useNavigate } from "react-router-dom";


export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [successignin, setSuccessignin] = useState(true);
  async function handleSignIn() {
    try {
      const url = "http://127.0.0.1:3000/api/v1/user/signin";
      const response = await axios.post(url, {
        username,
        password,
      });
      // console.log(response);

      localStorage.setItem("token", response.data.token);
      setSuccessignin(true);
      navigate("/dashboard");
    } catch {
      console.log("Invalid inputs");
      setSuccessignin(false);
    }
    
  }

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);




  
    return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center">
      <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
        <Heading label={"Sign in"} />
        <SubHeading label={"Enter your credentials to access your account"} />
        <InputBox onChange={(e)=>{
          setUsername(e.target.value);
        }} placeholder="shashank@gmail.com" label={"Email"} />
        <InputBox onChange={(e)=>{
          setPassword(e.target.value);
        }} placeholder="123456" label={"Password"} />
        <div className="pt-4">
          <Button label={"Sign in"}  onClick={handleSignIn} />
        </div>
        {!successignin && (
            <div>
              <p className="text-rose-600">Invalid credentials</p>
            </div>
          )}
        <BottomWarning label={"Don't have an account?"} buttonText={"Sign up"} to={"/signup"} />
      </div>
    </div>
  </div>
}