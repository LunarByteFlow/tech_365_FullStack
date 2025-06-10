import React, { useContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
// import "./App.css";

//yahan hum pury folders import krwa rahy ku k app.jsx se hi pata chalega k konsa folder chahiye
import Guest from "./Guest";
import Admin from "./Admin";
import Technician from "./Technician";
import ProductFinish from "./ProductFinish";



import { logincontext } from "./GlobalContext/context";
import { decodeToken } from "react-jwt";
import Inventory from "./Inventory";
// import  "./index.css"

//yeh ek object ha jismain names ko folders diye huay hain
const ComponentByRole = {
  guest: Guest,
  admin: Admin,
  inventory: Inventory,
  Technician: Technician,
  productfinish: ProductFinish,
};

//ab hum function bana rahy iska format hota ha const naamOfFunction = (parameters jo isky hoty) => {yahan jo bhi wo kr k return krta}
//yeh function parameter le raha or wo parameter bhej raha object ko phir hoga yeh k object main a jis se bhi match kr jayega a : b..... wo b return ayega
const takeRole = (parameter) =>
  ComponentByRole[parameter] || ComponentByRole["guest"]; //undefined values arahi hogi to or wala chal jayega

function App() {
  <>
    <h1>Hello World</h1>
  </>;

  //PREVIOUS WORK
  //ek usestate hook istemal kr rhy user ki states ko shru main khud set krdengy phir bad main usko change krwaty rahengy apny hisab se
  //syntax const[a, seta]= useState(wo value jo initially rakhni hoti ha )
  //const [Role, setRole] = useState('guest')
  //ab yeh role hamain khud nh dena ha yeh hamain context se chahiye jo k wo cookies se layega

  //PREVIOUS WORK BUT WITH CONTEXT AND COOKIE TOKEN

  //HOW TO USE GLOBAL CONTEXT
  //syntax = const {provider main jo values di thin wo} = usecontext(context jis name se banaya tha woh)
  // ab humny yeh context mungwa liya
  const { state, dispatch } = useContext(logincontext);
  console.log(state);

  //ek function banaya ha currentuser k naam se yeh function takeRole waly function ko value bhaje raha yani jab yeh run hoga tab takeRole bhi run hoga
  //jo bhi role useState se de rahy wo pehly current user mai ja raha phir takeRoll main phir object Componentbyroll main and then wahan se a:b   b value aa rahi jo k koi capital letter se start hony wali filename ha an humny usko ek tarha se print krwana ha
  const decodeUser = (authToken) => {
    if (!authToken) {
      return undefined;
    } else {
      const res = decodeToken(authToken);
      return res?.Role;
    }
  };

  const currentToken = decodeUser(state.person);
  const CurrentUser = takeRole(currentToken);

  return (
    <>
    
    <CurrentUser />
      {/* Dynamically render based on role */}
    </>
  );
}

export default App;
