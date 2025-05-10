import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../userContext";
import Alert from "./Alert";
import styled from "styled-components";
import axios from "axios";
import { logincontext } from "../../GlobalContext/context";
import Swal from 'sweetalert2'

import Cookies from "js-cookie";

// Styled components
const LoginPageContainer = styled.div`
  margin: 4rem auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 7rem;
  font-family: "Helvetica";

`;

const Form = styled.form`
  max-width: 30rem;
  margin: 0 auto;

  input {
    display: block;
    width: 100%;
    padding: 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    font-size: 1rem;
    &:focus {
      border-color: #3182ce; /* Change the border color to blue on focus */
      outline: none; /* Remove the default outline */
      /* Add any other styles you want for the focused state */
    }
  }

  button {
    display: block;
    width: 100%;
    padding: 1rem;
    background-color: #3182ce;
    color: #fff;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
    font-size: 1rem;

    &:hover {
      background-color: #2563eb;
    }
  }
`;

const RegisterLink = styled.div`
  text-align: center;
  margin-top: 1rem;

  a {
    color: #3182ce;
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      color: #2563eb;
    }
  }
`;

// LoginPage component
const UserLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(logincontext);
  let navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    const payload = {
      email: email,
      password: password,
    };
    console.log(Cookies);
    axios
      .post("http://localhost:8000/api/login", payload)
      .then((loginsuccess) => {
        Cookies.set("authToken", loginsuccess.data.authToken); // Set the authentication token cookie
        dispatch({
          type: "LOGIN_USER",
          person: loginsuccess.data.authToken,
        });
        const userData = loginsuccess;
        console.log({userData: userData});
        if (userData?.email && userData?.password) {
          const payload2 = {
            email: userData.email,
            password: userData.password,
          };
          console.log(`The data logged in : ${payload2}`);
          console.log(`The data logged in : ${payload2}`);
        }

        console.log(`Successfully Posted ${payload}`);
        Swal.fire({
          position: "top",
          icon: "success",
          title: "Successfully Logged In",
          showConfirmButton: false,
          timer: 1500
        });
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <LoginPageContainer className="my-14">
      <Title >Login</Title>
      <Form>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" onClick={handleLoginSubmit}>
          Login
        </button>
      </Form>
      <RegisterLink>
        Don't have an account yet? <Link to="/register">Registerrr here</Link>
      </RegisterLink>
    </LoginPageContainer>
  );
};

export default UserLoginPage;
