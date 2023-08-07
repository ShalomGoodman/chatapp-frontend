import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUsername = localStorage.getItem("username");
      const storedToken = localStorage.getItem("token");

      if (storedUsername && storedToken) {
        try {
          const SECRET = "this is a secret"; // JWT Secret
  
          // Verify the token
          const payload = jwt.verify(storedToken, SECRET);
  
          // Get the user's details from the server
          const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/accounts/${payload.id}`);
          const account = await response.json();

          if (account && account.data && account.data.attributes &&
              storedUsername === account.data.attributes.username &&
              storedToken === account.data.attributes.token) {
            // If the username and token match the stored details, it's a valid login
            router.push(`/chat/${storedToken}`);
          }
        } catch (error) {
          console.error(error);
          localStorage.removeItem("token");
          localStorage.removeItem("username");
        }
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    const SECRET = "this is a secret"; // JWT Secret
  
    try {
      // Verify the token
      const payload = jwt.verify(token, SECRET);
  
      // Get the user's details from the server
      const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/accounts/${payload.id}`);
      const account = await response.json();
  
      console.log('Account from server:', account);
  
      if (!account || !account.data || !account.data.attributes) {
        throw new Error("User not found");
      }
  
      console.log('Username from form:', username);
      console.log('Username from server:', account.data.attributes.username);
      console.log('Token from form:', token);
      console.log('Token from server:', account.data.attributes.token);
  
      // If the username and token match the stored details, it's a valid login
      if (username !== account.data.attributes.username || token !== account.data.attributes.token) {
        throw new Error("Invalid username or token");
      }
  
      // Store the username and token in local storage
      if (typeof window !== 'undefined') { // Check if window object exists
        localStorage.setItem("username", account.data.username);
        localStorage.setItem("token", account.data.token);
      }
  
      // Redirect to the chat room
      router.push(`/chat/${token}`);
  
    } catch (error) {
      console.error(error);
      alert("Invalid username or token");
    }
  };
  

  return (
    <div>
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label>
          Token:
          <input type="text" value={token} onChange={(e) => setToken(e.target.value)} />
        </label>
        <button type="submit">Log in</button>
      </form>
    </div>
  );
}
