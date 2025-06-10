// import React, { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import styled from "styled-components";
// import Swal from "sweetalert2";
// import axios from "axios";

// const FormContainer = styled.div`
//   margin: 4rem auto;
//   max-width: 30rem;
//   text-align: center;

//   h1 {
//     font-size: 2.5rem;
//   text-align: center;
//   margin-bottom: 2rem;
//   margin-top: 7rem;
//   font-family: "Helvetica";
//   }



//   input {
//     width: 100%;
//     padding: 1rem;
//     margin-bottom: 1rem;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     transition: border-color 0.3s;
//     &:focus {
//       border-color: #007bff;
//     }
//   }

//   button {
//     display: block;
//     width: 100%;
//     padding: 1rem;
//     margin-top: 1rem;
//     background-color: #007bff;
//     color: white;
//     border: none;
//     border-radius: 4px;
//     cursor: pointer;
//     transition: background-color 0.3s;
//     &:hover {
//       background-color: #0056b3;
//     }
//   }

//   .login-link {
//     font-weight: bold;
//     margin-top: 1rem;
//     display: block;
//     color: #007bff;
//     transition: color 0.3s;
//     &:hover {
//       color: #0056b3;
//     }
//   }
// `;

// const RegisterUser = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

  
//   let navigate = useNavigate();
//   const handleSignUpSubmit = async (e) => {
//     e.preventDefault();
//     const payload = {
//       name: name,
//       email: email,
//       password: password,
//     };
//     console.log(payload)
//     axios.post(`https://localhost:8000/api/createUser`, payload).then((json) => {
//       const payload2 = {
//         name: json.data.name,
//         email: json.data.email,
//         password: password,
//       };
//       console.log(`payload sent : ${payload2}`);
      
//     });
//     Swal.fire({
//       title: "Account Created",
//       text: "Thank you for Opening Account",
//       confirmButtonText: "Continue ",
//     });
//     navigate('/login')
//   };

//   return (
//     <FormContainer>
//       <h1>Register yourself</h1>
//       <form onSubmit={handleSignUpSubmit}>
//         <input
//           type="name"
//           name="name"
//           placeholder="Enter your name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//         />
//         <input
//           type="email"
//           name="email"
//           placeholder="123@email.com"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <button>Register</button>
//         <div className="text-center font-bold">
//           Already have an account???
//           <Link to={"/login"} className="login-link">
//             Login
//           </Link>
//         </div>
//       </form>
//     </FormContainer>
//   );
// };

// export default RegisterUser;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import axios from "axios";

const FormContainer = styled.div`
  /* your styles */
`;

const RegisterUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("technician"); // default role or empty string

  const navigate = useNavigate();

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      email,
      password,
      role,  // <-- send role here
    };

    try {
      const response = await axios.post(`https://localhost:8000/api/createUser`, payload);
      
      Swal.fire({
        title: "Account Created",
        text: "Thank you for Registering the User",
        confirmButtonText: "Continue",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Registration failed",
        icon: "error",
      });
    }
  };

  return (
    <FormContainer>
      <h1>Register yourself</h1>
      <form onSubmit={handleSignUpSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="123@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Role selector */}
        <select
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="admin">Admin</option>
          <option value="technician">Technician</option>
          <option value="Inventory">Inventory</option>
          <option value="productfinish">Product Finish</option>
        </select>

        <button type="submit">Register</button>
        <div className="text-center font-bold">
          Already have an account???{" "}
          <Link to={"/login"} className="login-link">
            Login
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default RegisterUser;
