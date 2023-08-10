import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import ChatRoom from "../../components/index";
import { toast } from 'react-toastify';

export default function Chat() {
  const router = useRouter();
  const SECRET = "this is a secret"; // JWT Secret
  const [done, setDone] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [userr, setUserr] = useState("");

  const token = router.query.token;

  useEffect(() => {
    if (!router.isReady) return console.log("Router is not ready yet. Loading... Please wait");

    console.log("Token from URL:", token);

    // if (!token) return router.push("/");

    try {
      const payload = jwt.verify(token, SECRET);
      console.log("JWT payload:", payload);

      async function fetchData() {
        console.log("Fetching from server URL:", process.env.NEXT_PUBLIC_STRAPI_SERVER_URL);
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/accounts/${payload.id}/?populate=active_user`)
          .then(async (e) => {
            const account = await e.json();
            console.log("Account fetched:", account);
            setUsername(account.data.attributes.username);
            setId(account.data.id);
            setUserr(done);

            if (typeof window !== 'undefined') { // <-- Check if window object exists
              console.log("Setting values in local storage.");
              localStorage.setItem("username", account.data.attributes.username);
              localStorage.setItem("token", account.data.attributes.token);
              localStorage.setItem("id", account.data.id);
              localStorage.setItem("active_user", account.data.attributes.active_user.data.id);
            }

            if (token !== account.data.attributes.token) {
              console.warn("Token mismatch detected:", token, account.data.attributes.token);
              if (typeof window !== 'undefined') { // <-- Check if window object exists
                console.log("Removing items from local storage due to token mismatch.");
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("id");
                localStorage.removeItem("active_user");
              }
              return router.push("/");
            }
          })
          .catch((e) => {
            toast.error(`An error occurred while fetching the account: ${e.message}`);
            console.error("An error occurred while fetching the account:", e.message);
            if (typeof window !== 'undefined') { // <-- Check if window object exists
              console.log("Removing items from local storage due to error.");
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              localStorage.removeItem("id");
              localStorage.removeItem("active_user");
            }
            return router.push("/");
          });
      }
      fetchData();
      setDone("done");
    } catch (error) {
      console.error("Error during token verification:", error.message);
      router.push("/");
    }
  }, [token, userr, done]);
  return (
    <div>
      {done == "done" && userr === "done" ? (
        <ChatRoom username={username} id={1} userId={id} />
      ) : (
        <h1>Verifying token..... Please wait</h1>
      )}
    </div>
  );
}
