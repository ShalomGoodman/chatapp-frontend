/* eslint-disable */
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import ChatRoom from "../../components/index";

export default function Chat() {
  const router = useRouter();
  const SECRET = "this is a secret"; // JWT Secret
  const [done, setDone] = useState("");
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const [userr, setUserr] = useState("");

  const token = router.query.token; 
  


  useEffect(() => {
    if (!router.isReady) return console.log("Loading... Please wait");

    if (!token) return router.push("/");

    try {
      const payload = jwt.verify(token, SECRET);
      async function fetchData() {
        console.log(process.env.NEXT_PUBLIC_STRAPI_SERVER_URL);
        await fetch(`${process.env.NEXT_PUBLIC_STRAPI_SERVER_URL}/api/accounts/${payload.id}/?populate=active_user`)
          .then(async (e) => {
            const account = await e.json();
            console.log(account);
            setUsername(account.data.attributes.username);
            setId(account.data.id);
            setUserr(done);
            if (typeof window !== 'undefined') { // <-- Check if window object exists
              localStorage.setItem("username", account.data.attributes.username);
              localStorage.setItem("token", account.data.attributes.token);
              localStorage.setItem("id", account.data.id);
              const activeUserId = account?.data?.attributes?.active_user?.data?.id;
            if (activeUserId !== undefined) {
              localStorage.setItem("active_user", activeUserId);
            }

            }
            if (token !== account.data.attributes.token) {
              if (typeof window !== 'undefined') { // <-- Check if window object exists
                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("id");
                localStorage.removeItem("active_user");
              }
              return router.push("/");
            }
          })
          .catch((e) => {
            console.log(e.message);
            if (typeof window !== 'undefined') { // <-- Check if window object exists
              localStorage.removeItem("token");
              localStorage.removeItem("username");
            }
            return router.push("/");
          });
      }
      fetchData();
      setDone("done");
    } catch (error) {
      console.log("error", error.message);
      router.push("/");
    }
  }, [token, userr, done]);
  return (
    <div>
      {done == "done" && userr === "done" ? ( // Waiting for access to be granted
        <ChatRoom username={username} id={1} userId={id} />
      ) : (
        <h1>Verifying token..... Please wait</h1>
      )}
    </div>
  );
}
