import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logincontext } from "../../GlobalContext/context";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import axios from "axios";
import styled from "styled-components";

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


const UserLoginPage=()=>{
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const { dispatch } = useContext(logincontext);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:8000/api/login", credentials);

      // 1️⃣ store token (cookie or localStorage):
      Cookies.set("authToken", data.authToken, { sameSite: "lax" });

      // 2️⃣ optionally store role in a cookie (not strictly necessary):
      Cookies.set("ROLE", data.user.role, { sameSite: "lax" });

      // 3️⃣ update global context:
      dispatch({
        type: "LOGIN_USER",
        person: data.authToken,
        role: data.user.role,
      });

      // 4️⃣ success message:
      Swal.fire({ icon: "success", title: "Successfully logged in", timer: 1500, showConfirmButton: false });

      // 5️⃣ redirect by role:
      const role = data.user.role.toLowerCase();
      navigate(role === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({ icon: "error", title: "Login failed", text: err.response?.data?.message || "Please try again" });
    }
  };

  return (
    <LoginPageContainer>
      <Title>Login</Title>
      <Form onSubmit={handleLoginSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </Form>
      <RegisterLink>
        Don&apos;t have an account yet? <Link to="/register">Register here</Link>
      </RegisterLink>
    </LoginPageContainer>
  );
}
// LoginPage component
// const UserLoginPage = () => {
//   const [credentials, setCredentials] = useState({
//     email: "",
//     password: "",
//     role: "",
//   });
//   const { dispatch } = useContext(logincontext);
//   let navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Email:", credentials.email);
//     console.log("Password:", credentials.password);
//     console.log("Role:", credentials.role); // Added role for logging

//     const payload = {
//       email: credentials.email,
//       password: credentials.password,
//       role: credentials.role, // Added role to the payload
//     };

//     axios
//       .post("http://localhost:8000/api/login", payload)
//       .then((loginsuccess) => {
//         Cookies.set("authToken", loginsuccess.data.authToken); // Set the authentication token cookie

// //MAHNOOR YAMEEN WORK
// Cookies.set("ROLE", loginsuccess.data.authToken.role); // i am considering k aapky authtoken k ander role hoga jo k main cookies m set krwa rhi hun

//         dispatch({
//           type: "LOGIN_USER",
//           person: loginsuccess.data.authToken,
// // MAHNOOR ALTERATION
// role: loginsuccess.data.role
//         });

//         // Checking if the login was successful and user has role
//         const userData = loginsuccess.data;
//         console.log("User Data:", userData);

//         // If role is provided, we can check the role and do any further logic
//         if (userData?.role && userData.role === "admin") {
//           console.log("Admin logged in.");
//         }
//         if (userData?.role && userData.role === "user") {
//           console.log("User logged in.");
//         }

//         Swal.fire({
//           position: "top",
//           icon: "success",
//           title: "Successfully Logged In",
//           showConfirmButton: false,
//           timer: 1500,
//         });

//         if (userData?.role?.toLowerCase() === "admin") {
//           navigate("/admin/home");
//         } else if (userData?.role?.toLowerCase() === "user") {
//           navigate("/user/home");
//         }
//         // else {
//         //   navigate("/"); // fallback or handle unknown roles
//         // }
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   };

//   return (
//     <LoginPageContainer className="my-14">
//       <Title>Login</Title>
//       <Form onSubmit={handleLoginSubmit}>
//         <input
//           type="email"
//           name="email"
//           id="email"
//           placeholder="Enter your email"
//           value={credentials.email}
//           onChange={(e) =>
//             setCredentials({ ...credentials, email: e.target.value })
//           }
//         />
//         <input
//           type="password"
//           name="password"
//           id="password"
//           placeholder="Enter your password"
//           value={credentials.password}
//           onChange={(e) =>
//             setCredentials({ ...credentials, password: e.target.value })
//           }
//         />
//         {/* Added role input field */}
//         <input
//           type="text"
//           name="role"
//           id="role"
//           placeholder="Enter your role (e.g., admin)"
//           value={credentials.role}
//           onChange={(e) =>
//             setCredentials({ ...credentials, role: e.target.value })
//           }
//         />
//         <button onClick={handleLoginSubmit}>Login</button>
//       </Form>
//       <RegisterLink>
//         Don't have an account yet? <Link to="/register">Register here</Link>
//       </RegisterLink>
//     </LoginPageContainer>
//   );
// };

export default UserLoginPage;