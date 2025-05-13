import AdminHome from "./components/AdminHome";

function App() {
  const { state, dispatch } = useContext(logincontext);
  console.log(state);

  const decodeUser = (authToken) => {
    if (!authToken) {
      return undefined;
    } else {
      const res = decodeToken(authToken);
      return res?.role; // Use lowercase "role" here
    }
  };

  const currentToken = decodeUser(state.person);
  const CurrentUser = takeRole(currentToken);

  return (
    <>
      <Route path="/" element={<CurrentUser />} />{" "}
      <Route path="/admin" element={<AdminHome />} />
      {/* Dynamically render based on role */}
    </>
  );
}
