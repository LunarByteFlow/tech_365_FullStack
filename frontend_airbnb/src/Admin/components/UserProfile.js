import axios from 'axios';
import React,{useState,useEffect} from 'react'
import { useParams } from 'react-router-dom';
import Footer from '../../Guest/pages/Footer';


const UserProfile = () => {
  const [user,setUser] = useState();
  const [loading,setLoading] = useState(false);
  const {_id} = useParams();
  const [error,setError] = useState(false);
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/getuser');
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (

    <>
    
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {user && (
        <div>
          <h2>User Profile</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          {/* Add more user details as needed */}
        </div>
      )}
    </div>
    <Footer/>
    </>
  )
}

export default UserProfile
