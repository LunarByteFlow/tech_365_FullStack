const express = require("express");
const mongoose = require("mongoose");
const Cookies = require("js-cookie");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const { fileURLToPath } = require("url");
const { dirname } = require("path");
const path = require("path");
const User = require("./UserModel.js");
const { connect } = require("connect");
const dotenv = require("dotenv");
const { sign } = require("jsonwebtoken");
const jwt  = require("jsonwebtoken");
const sql = require('mssql');
const { connectDB } = require("../../SSMS_DB.js");



// import multer from "multer";

dotenv.config();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

//Creating a string for JWT authentication.
const JWT_SECRET = "jbhjbhebfjkdnnbjknuejejnn";

// Define createUser function
const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  // Allowed roles for registration
  const allowedRoles = ["admin", "technician",'inventory', "product_finish"];

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate role
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}` });
  }

  try {
    // Connect to SQL Server
    await connectDB();

    // Check if user already exists
    const checkUser = await sql.query`SELECT * FROM Users WHERE email = ${email}`;
    if (checkUser.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists.",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database with the requested role
    await sql.query`
      INSERT INTO Users (name, email, password, role)
      VALUES (${name}, ${email}, ${hashedPassword}, ${role})
    `;

    // Create JWT token with role
    const authToken = jwt.sign(
      { name, email, role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send cookie with token
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 3600000, // 1 hour
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      authToken,
      user: {
        name,
        email,
        role,
      },
    });
  } catch (error) {
    console.error("Create User Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing Required Fields" });
  }

  try {
    await connectDB(); // Connect to SQL Server

    const request = new sql.Request();

    // Find user by email using parameterized query
    const result = await request
      .input("email", sql.VarChar, email)
      .query("SELECT * FROM Users WHERE email = @email");

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({ message: "User Doesn't Exist" });
    }

    // Compare password with hashed password stored in DB
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Create token payload
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    console.log("JWT object:", jwt);  // Add this line to check if jwt is correctly imported

    // Generate JWT token
    const authToken = jwt.sign(userData, JWT_SECRET, { expiresIn: "1h" });

    // Send the token in a cookie (Secure in production environment)
    res.cookie("authToken", authToken, {
      httpOnly: true,
      secure: true,  // Secure cookies in production
      sameSite: "lax",  // Helps prevent cross-site request forgery
      maxAge: 3600000,  // Cookie expiration time (1 hour)
    });

    // Return successful login response
    res.status(200).json({
      success: true,
      message: "Successfully Logged in",
      authToken,
      user: userData,
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
//ROUTE 3: Get the details of the logged In User.[/api/auth/getuser]
const getUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // This will display every thing from the user object exept the password.
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
};

//ROUTE 4: Get the details of the logged In User.[/api/auth/getuser]
const Logout = async (req, res) => {
  res.cookie("token", "").json(true);
};
// auth.post("/logout", async (req, res) => {
//     res.cookie("token", "").json(true);
//   });


const updateUser = async (req, res) => {
  const { id, name, email, password, role } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const allowedRoles = ["admin", "technician", "inventory", "product_finish"];
  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({ message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}` });
  }

  try {
    await connectDB(); // Connect to SQL Server

    const request = new sql.Request();

    // Check if user exists
    const existingUser = await request
      .input("id", sql.Int, id)
      .query("SELECT * FROM Users WHERE id = @id");

    if (existingUser.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prepare update fields
    const updates = [];
    if (name) updates.push(`name = @name`);
    if (email) updates.push(`email = @email`);
    if (role) updates.push(`role = @role`);
    if (password) updates.push(`password = @password`);

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    // Input values
    if (name) request.input("name", sql.VarChar, name);
    if (email) request.input("email", sql.VarChar, email);
    if (role) request.input("role", sql.VarChar, role);
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      request.input("password", sql.VarChar, hashedPassword);
    }

    // Perform update
    const updateQuery = `UPDATE Users SET ${updates.join(", ")} WHERE id = @id`;
    await request.query(updateQuery);

    res.status(200).json({ success: true, message: "User updated successfully" });

  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};


module.exports = {
  createUser,
  Logout,
  getUser,
  Login,
  updateUser,
};

