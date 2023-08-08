import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import { useRouter } from "next/router";
import { toast } from 'react-toastify';

export default function Home() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState("");

  const router = useRouter();

  useEffect(() => {

    const checkLoginStatus = async () => {
      const storedUsername = localStorage.getItem("username");
      const storedToken = localStorage.getItem("token");

      if (storedUsername && storedToken) {
        console.log("useEffect");
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
            toast.success(`Welcome back, ${storedUsername}!`);
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

  const handlesubmit = async (e) => {
    e.preventDefault();
    const id = Math.trunc(Math.random() * 1000000);
    let account = {
      id,
    };
    const SECRET = "this is a secret";
    const token = jwt.sign(account, SECRET);
    let message = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/chat/${token}`;
    let data = {
      email, // User's email
      message,
    };

    let strapiData = {
      data: {
        id,
        username: user,
        email,
        token,
      },
    };
    toast.loading('Sending Email...');
    await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/accounts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(strapiData),
    })
      .then(async (res) => {
        console.log(await res.json());
      })
      .catch((err) => console.log(err.message));
    await fetch("/api/mail", {
      method: "POST", // POST request to /api//mail
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        console.log("fetching");
        if (res.status === 200) {
          toast.dismiss();
          toast.success(`Verification email sent to ${email}!`, { autoClose: 2000 } );
          console.log(await res.json());
        } else {
          toast.dismiss();
          toast.error(`There was an unexpected problem, please try again.`, { autoClose: 2000 } );
          console.log(await res.json());
        }
      })
      .catch((err) => console.log(err.message));
    setEmail("");
    setUser("");
  };
  return (
    <div className={styles.container}>
      <form className={styles.main}>
        <h1>Signup</h1>
        <label htmlFor="user">Username: </label>
        <input
          type="text"
          id="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email: </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Getting the inputs
        />
        <br />
        <input type="submit" onClick={handlesubmit} />
      </form>
    </div>
  );
}
