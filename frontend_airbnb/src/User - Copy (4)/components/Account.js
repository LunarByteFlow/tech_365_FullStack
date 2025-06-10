import React, { useContext } from "react";
import { UserContext } from "../userContext";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loading from "./LoadingSpinner";
import PlacesPage from "./PlacesPage";

const Account = () => {
  const { ready, user } = useContext(UserContext);
  let navigate = useNavigate();
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }
  function linkClasses(type = null) {
    let link_classes = "inline-flex gap-2 py-2 px-6";
    if (type === subpage || (subpage === undefined && type === "profile")) {
      link_classes = `bg-primary text-white rounded-full py-2 px-6 inline-flex gap-2 `;
    } else {
      link_classes = `bg-gray-200 rounded-full py-2 px-6 inline-flex gap-2 `;
    }
    return link_classes;
  }

  if (!ready) {
    return <Loading />;
  }
  if (ready && !user) {
    return navigate("/login");
  }
  return (
    <>
      <div>
        <nav className="w-full flex mt-8 gap-2 justify-center">
          <Link className={linkClasses("profile")} to={"/account/"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            My Profile
          </Link>

          <Link className={linkClasses("bookings")} to={"/account/bookings"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                clipRule="evenodd"
              />
            </svg>
            My Bookings
          </Link>
          <Link className={linkClasses("my-places")} to={"/account/my-places"}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819"
              />
            </svg>
            My Accommodations
          </Link>
        </nav>

        {subpage === "profile" && (
          <div className="mt-6 text-center">
            <p className="text-lg font-semibold">User Info</p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Name:</span> {user.name}
            </p>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
            <button className="mt-4 bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full">
              Logout
            </button>
          </div>
        )}
        {subpage === "my-places" && (
          <div>
            <PlacesPage />
          </div>
        )}
      </div>
    </>
  );
};

export default Account;
