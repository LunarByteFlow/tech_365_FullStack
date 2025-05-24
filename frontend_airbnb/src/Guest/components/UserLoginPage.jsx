// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { logincontext } from "../../GlobalContext/context";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import axios from "axios";
// import styled from "styled-components";

// // Styled components
// const LoginPageContainer = styled.div`
//   margin: 4rem auto;
// `;

// const Title = styled.h1`
//   font-size: 2.5rem;
//   text-align: center;
//   margin-bottom: 2rem;
//   margin-top: 7rem;
//   font-family: "Helvetica";
// `;

// const Form = styled.form`
//   max-width: 30rem;
//   margin: 0 auto;

//   input {
//     display: block;
//     width: 100%;
//     padding: 0.75rem;
//     margin-bottom: 1rem;
//     border: 1px solid #ccc;
//     border-radius: 0.5rem;
//     font-size: 1rem;
//     &:focus {
//       border-color: #3182ce; /* Change the border color to blue on focus */
//       outline: none; /* Remove the default outline */
//       /* Add any other styles you want for the focused state */
//     }
//   }

//   button {
//     display: block;
//     width: 100%;
//     padding: 1rem;
//     background-color: #3182ce;
//     color: #fff;
//     border: none;
//     border-radius: 0.5rem;
//     cursor: pointer;
//     transition: background-color 0.3s ease;
//     font-size: 1rem;

//     &:hover {
//       background-color: #2563eb;
//     }
//   }
// `;

// const RegisterLink = styled.div`
//   text-align: center;
//   margin-top: 1rem;

//   a {
//     color: #3182ce;
//     font-weight: bold;
//     text-decoration: none;
//     transition: color 0.3s ease;

//     &:hover {
//       color: #2563eb;
//     }
//   }
// `;


// const UserLoginPage=()=>{
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const { dispatch } = useContext(logincontext);
//   const navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { data } = await axios.post("http://localhost:8000/api/login", credentials);

//       // 1️⃣ store token (cookie or localStorage):
//       Cookies.set("authToken", data.authToken, { sameSite: "lax" });

//       // 2️⃣ optionally store role in a cookie (not strictly necessary):
//       Cookies.set("ROLE", data.user.role, { sameSite: "lax" });

//       // 3️⃣ update global context:
//       dispatch({
//         type: "LOGIN_USER",
//         person: data.authToken,
//         role: data.user.role,
//       });

//       // 4️⃣ success message:
//       Swal.fire({ icon: "success", title: "Successfully logged in", timer: 1500, showConfirmButton: false });

//       // 5️⃣ redirect by role:
//       const role = data.user.role.toLowerCase();
//       navigate(role === "admin" ? "/admin" : "/user");
//     } catch (err) {
//       console.error("Login error:", err);
//       Swal.fire({ icon: "error", title: "Login failed", text: err.response?.data?.message || "Please try again" });
//     }
//   };

//   return (
//     <LoginPageContainer>
//       <Title>Login</Title>
//       <Form onSubmit={handleLoginSubmit}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={credentials.email}
//           onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
//           required
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={credentials.password}
//           onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
//           required
//         />
//         <button type="submit">Login</button>
//       </Form>
//       <RegisterLink>
//         Don&apos;t have an account yet? <Link to="/register">Register here</Link>
//       </RegisterLink>
//     </LoginPageContainer>
//   );
// }


// export default UserLoginPage;

import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logincontext } from "../../GlobalContext/context";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from "axios";
import styled, { keyframes } from "styled-components";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Styled Components
const LoginPageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right,  #2fd76a,#e3daee);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Segoe UI", sans-serif;
`;

const Card = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  animation: ${fadeIn} 0.8s ease-out;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  padding: 0.9rem;
  margin-bottom: 1.2rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: 0.3s;

  &:focus {
    border-color: #6a11cb;
    outline: none;
    box-shadow: 0 0 8px rgba(106, 17, 203, 0.2);
  }
`;

const Button = styled.button`
  background: #6a11cb;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #5011b8;
  }
`;

const RegisterLink = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.95rem;

  a {
    color: #6a11cb;
    font-weight: bold;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      color: #5011b8;
    }
  }
`;

// Component
const UserLoginPage = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { dispatch } = useContext(logincontext);
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/login`, credentials);

      Cookies.set("authToken", data.authToken, { sameSite: "lax" });
      Cookies.set("ROLE", data.user.role, { sameSite: "lax" });

      dispatch({
        type: "LOGIN_USER",
        person: data.authToken,
        role: data.user.role,
      });

      Swal.fire({
        icon: "success",
        title: "Successfully logged in",
        timer: 1500,
        showConfirmButton: false,
      });

      const role = data.user.role.toLowerCase();
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.response?.data?.message || "Please try again",
      });
    }
  };

  return (
    <LoginPageContainer>
      <Card>
        <Title>Welcome Back 👋</Title>
        <Form onSubmit={handleLoginSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          <Button type="submit">Login</Button>
        </Form>
      </Card>
    </LoginPageContainer>
  );
};

export default UserLoginPage;

