import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import axios from "axios";

const FormContainer = styled.div`
  margin: 4rem auto;
  max-width: 30rem;
  text-align: center;

  h1 {
    font-size: 2.5rem;
  text-align: center;
  margin-bottom: 2rem;
  margin-top: 7rem;
  font-family: "Helvetica";
  }



  input {
    width: 100%;
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
    &:focus {
      border-color: #007bff;
    }
  }

  button {
    display: block;
    width: 100%;
    padding: 1rem;
    margin-top: 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
      background-color: #0056b3;
    }
  }

  .login-link {
    font-weight: bold;
    margin-top: 1rem;
    display: block;
    color: #007bff;
    transition: color 0.3s;
    &:hover {
      color: #0056b3;
    }
  }
`;

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  
  let navigate = useNavigate();
  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: name,
      email: email,
      password: password,
    };
    console.log(payload)
    axios.post(`http://localhost:8000/api/createUser`, payload).then((json) => {
      const payload2 = {
        name: json.data.name,
        email: json.data.email,
        password: password,
      };
      console.log(`payload sent : ${payload2}`);
      
    });
    Swal.fire({
      title: "Account Created",
      text: "Thank you for Opening Account",
      confirmButtonText: "Continue ",
    });
    navigate('/login')
  };

  return (
    <FormContainer>
      <h1>Register yourself</h1>
      <form onSubmit={handleSignUpSubmit}>
        <input
          type="name"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="123@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Register</button>
        <div className="text-center font-bold">
          Already have an account???
          <Link to={"/login"} className="login-link">
            Login
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default RegisterUser;
