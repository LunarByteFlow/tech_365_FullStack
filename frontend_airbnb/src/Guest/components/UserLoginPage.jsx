// // import React, { useState, useContext } from "react";
// // import { useNavigate, Link } from "react-router-dom";
// // import { logincontext } from "../../GlobalContext/context";
// // import Swal from "sweetalert2";
// // import Cookies from "js-cookie";
// // import axios from "axios";
// // import styled, { keyframes } from "styled-components";
// // import { supabase } from "../../supabase/SupabaseClient";
// // // Animations
// // const fadeIn = keyframes`
// //   from {
// //     opacity: 0;
// //     transform: translateY(40px);
// //   }
// //   to {
// //     opacity: 1;
// //     transform: translateY(0);
// //   }
// // `;

// // // Styled Components
// // const LoginPageContainer = styled.div`
// //   min-height: 100vh;
// //   background: linear-gradient(to right, #2fd76a, #e3daee);
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-family: "Segoe UI", sans-serif;
// // `;

// // const Card = styled.div`
// //   background: #fff;
// //   padding: 3rem;
// //   border-radius: 1rem;
// //   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
// //   width: 100%;
// //   max-width: 400px;
// //   animation: ${fadeIn} 0.8s ease-out;
// // `;

// // const Title = styled.h1`
// //   text-align: center;
// //   font-size: 2rem;
// //   margin-bottom: 1.5rem;
// //   color: #333;
// // `;

// // const Form = styled.form`
// //   display: flex;
// //   flex-direction: column;
// // `;

// // const Input = styled.input`
// //   padding: 0.9rem;
// //   margin-bottom: 1.2rem;
// //   border: 1px solid #ccc;
// //   border-radius: 0.5rem;
// //   font-size: 1rem;
// //   transition: 0.3s;

// //   &:focus {
// //     border-color: #6a11cb;
// //     outline: none;
// //     box-shadow: 0 0 8px rgba(106, 17, 203, 0.2);
// //   }
// // `;

// // const Button = styled.button`
// //   background: #6a11cb;
// //   color: white;
// //   border: none;
// //   padding: 1rem;
// //   border-radius: 0.5rem;
// //   font-size: 1.1rem;
// //   cursor: pointer;
// //   transition: background 0.3s;

// //   &:hover {
// //     background: #5011b8;
// //   }
// // `;

// // const RegisterLink = styled.div`
// //   margin-top: 1.5rem;
// //   text-align: center;
// //   font-size: 0.95rem;

// //   a {
// //     color: #6a11cb;
// //     font-weight: bold;
// //     text-decoration: none;

// //     &:hover {
// //       text-decoration: underline;
// //       color: #5011b8;
// //     }
// //   }
// // `;

// // // Component
// // const UserLoginPage = () => {
// //   const [credentials, setCredentials] = useState({ email: "", password: "" });
// //   const { dispatch } = useContext(logincontext);
// //   const navigate = useNavigate();
// //   const BASE_URL = "http://10.2.0.2:8000/api";

// //   const handleLoginSubmit = async (e) => {
// //     e.preventDefault();

// //     try {
// //       const { data } = await axios.post(`${BASE_URL}/login`, credentials);

// //       Cookies.set("authToken", data.authToken, { sameSite: "lax" });
// //       Cookies.set("ROLE", data.user.role, { sameSite: "lax" });

// //       dispatch({
// //         type: "LOGIN_USER",
// //         person: data.authToken,
// //         role: data.user.role,
// //       });

// //       Swal.fire({
// //         icon: "success",
// //         title: "Successfully logged in",
// //         timer: 1500,
// //         showConfirmButton: false,
// //       });

// //       const role = data.user.role.toLowerCase();
// //       navigate(role === "admin" ? "/admin" : "/user");
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       Swal.fire({
// //         icon: "error",
// //         title: "Login failed",
// //         text: err.response?.data?.message || "Please try again",
// //       });
// //     }
// //   };

// //   return (
// //     <LoginPageContainer>
// //       <Card>
// //         <Title>Welcome Back 👋</Title>
// //         <Form onSubmit={handleLoginSubmit}>
// //           <Input
// //             type="email"
// //             placeholder="Email"
// //             value={credentials.email}
// //             onChange={(e) =>
// //               setCredentials({ ...credentials, email: e.target.value })
// //             }
// //             required
// //           />
// //           <Input
// //             type="password"
// //             placeholder="Password"
// //             value={credentials.password}
// //             onChange={(e) =>
// //               setCredentials({ ...credentials, password: e.target.value })
// //             }
// //             required
// //           />
// //           <Button type="submit">Login</Button>
// //         </Form>
// //       </Card>
// //     </LoginPageContainer>
// //   );
// // };

// // export default UserLoginPage;

// import React, { useState, useContext } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { logincontext } from "../../GlobalContext/context";
// import Swal from "sweetalert2";
// import Cookies from "js-cookie";
// import styled, { keyframes } from "styled-components";
// import { supabase } from "../../supabase/SupabaseClient"; // ✅ make sure supabase client is initialized

// // Animations
// const fadeIn = keyframes`
//   from {
//     opacity: 0;
//     transform: translateY(40px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// // Styled Components
// const LoginPageContainer = styled.div`
//   min-height: 100vh;
//   background: linear-gradient(to right, #2fd76a, #e3daee);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-family: "Segoe UI", sans-serif;
// `;

// const Card = styled.div`
//   background: #fff;
//   padding: 3rem;
//   border-radius: 1rem;
//   box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
//   width: 100%;
//   max-width: 400px;
//   animation: ${fadeIn} 0.8s ease-out;
// `;

// const Title = styled.h1`
//   text-align: center;
//   font-size: 2rem;
//   margin-bottom: 1.5rem;
//   color: #333;
// `;

// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
// `;

// const Input = styled.input`
//   padding: 0.9rem;
//   margin-bottom: 1.2rem;
//   border: 1px solid #ccc;
//   border-radius: 0.5rem;
//   font-size: 1rem;
//   transition: 0.3s;

//   &:focus {
//     border-color: #6a11cb;
//     outline: none;
//     box-shadow: 0 0 8px rgba(106, 17, 203, 0.2);
//   }
// `;

// const Button = styled.button`
//   background: #6a11cb;
//   color: white;
//   border: none;
//   padding: 1rem;
//   border-radius: 0.5rem;
//   font-size: 1.1rem;
//   cursor: pointer;
//   transition: background 0.3s;

//   &:hover {
//     background: #5011b8;
//   }
// `;

// const RegisterLink = styled.div`
//   margin-top: 1.5rem;
//   text-align: center;
//   font-size: 0.95rem;

//   a {
//     color: #6a11cb;
//     font-weight: bold;
//     text-decoration: none;

//     &:hover {
//       text-decoration: underline;
//       color: #5011b8;
//     }
//   }
// `;

// // Component
// const UserLoginPage = () => {
//   const [credentials, setCredentials] = useState({ email: "", password: "" });
//   const { dispatch } = useContext(logincontext);
//   const navigate = useNavigate();

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       // Check user manually from your "users" table
//       const { data, error } = await supabase
//         .from("users")
//         .select("id, email, password, role")
//         .eq("email", credentials.email)
//         .single();

//       if (error || !data) throw new Error("Invalid credentials");

//       // You’ll need to compare the password manually (Supabase doesn’t auto-hash unless you use auth)
//       if (data.password !== credentials.password) {
//         throw new Error("Invalid credentials");
//       }

//       // Set cookies / context
//       Cookies.set("authToken", data.id, { sameSite: "lax" }); // or create your own token
//       Cookies.set("ROLE", data.role, { sameSite: "lax" });

//       dispatch({
//         type: "LOGIN_USER",
//         person: data.id,
//         role: data.role,
//       });

//       Swal.fire({
//         icon: "success",
//         title: "Successfully logged in",
//         timer: 1500,
//         showConfirmButton: false,
//       });

//       navigate(data.role.toLowerCase() === "admin" ? "/admin" : "/user");
//     } catch (err) {
//       console.error("Login error:", err.message);
//       Swal.fire({
//         icon: "error",
//         title: "Login failed",
//         text: err.message || "Please try again",
//       });
//     }
//   };

//   return (
//     <LoginPageContainer>
//       <Card>
//         <Title>Welcome Back 👋</Title>
//         <Form onSubmit={handleLoginSubmit}>
//           <Input
//             type="email"
//             placeholder="Email"
//             value={credentials.email}
//             onChange={(e) =>
//               setCredentials({ ...credentials, email: e.target.value })
//             }
//             required
//           />
//           <Input
//             type="password"
//             placeholder="Password"
//             value={credentials.password}
//             onChange={(e) =>
//               setCredentials({ ...credentials, password: e.target.value })
//             }
//             required
//           />
//           <Button type="submit">Login</Button>
//         </Form>

//         {/* Optional link to register page */}
//         <RegisterLink>
//           Don’t have an account? <Link to="/register">Sign Up</Link>
//         </RegisterLink>
//       </Card>
//     </LoginPageContainer>
//   );
// };

// export default UserLoginPage;


import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { logincontext } from "../../GlobalContext/context";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import styled, { keyframes } from "styled-components";
import { supabase } from "../../supabase/SupabaseClient"; // ✅ supabase client initialized

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
  background: linear-gradient(to right, #2fd76a, #e3daee);
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

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Fetch user from Supabase users table
      const { data, error } = await supabase
        .from("Users")
        .select("id, email, password, role")
        .eq("email", credentials.email)
        .single();

      if (error || !data) {
        throw new Error("User not found");
      }

      // ✅ Compare password (plain-text check for now)
      if (data.password !== credentials.password) {
        throw new Error("Invalid password");
      }

      // ✅ Save user info in cookies/context
      Cookies.set("authToken", data.id, { sameSite: "lax" }); // using user id as "token"
      Cookies.set("ROLE", data.role, { sameSite: "lax" });

      dispatch({
        type: "LOGIN_USER",
        person: data.id,
        role: data.role,
      });

      Swal.fire({
        icon: "success",
        title: "Successfully logged in",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate(data.role.toLowerCase() === "admin" ? "/admin" : "/user");
    } catch (err) {
      console.error("Login error:", err.message);
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: err.message || "Please try again",
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
            onChange={(e) =>
              setCredentials({ ...credentials, email: e.target.value })
            }
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            required
          />
          <Button type="submit">Login</Button>
        </Form>

        {/* Optional link to register page */}
        <RegisterLink>
          Don’t have an account? <Link to="/register">Sign Up</Link>
        </RegisterLink>
      </Card>
    </LoginPageContainer>
  );
};

export default UserLoginPage;
