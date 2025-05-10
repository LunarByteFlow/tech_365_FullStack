import React, { useState } from "react";
import axios from "axios";

const ContactUs = () => {
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = async (e) => {

    try {
      e.preventDefault();
      // Create an object to represent the data

      const postData = {
        contactname: contactName,
        contactemail: contactEmail,
        message: message,
      };
      // const postData = new FormData();
      // postData.append("contactname", contactName);
      // postData.append("contactemail", contactEmail);
      // postData.append("message", message);

      // Make a POST request to your backend API
      const response = await axios.post(
        "http://localhost:1234/api/contactSubmit",
        postData
      );

      // Handle the response from the server
      console.log("Response from server:", response.data);
      //   setIsModalOpen(true);
    } catch (error) {
      // Handle errors
      console.error("Error posting ad:", error);
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>
        <div>
          {/* Full Name */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-600"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={contactName}
              onChange={(event) => {
                setContactName(event.target.value);
              }}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactEmail}
              onChange={(event) => {
                setContactEmail(event.target.value);
              }}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>

          {/* Message */}
          <div className="mb-4">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-600"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
              }}
              rows="4"
              className="mt-1 p-2 w-full border rounded-md"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            onClick={handleContactSubmit}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
