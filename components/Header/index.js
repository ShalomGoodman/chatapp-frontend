import React from "react";
import Image from 'next/image'
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

function Header(props) {

  const router = useRouter();

  const handleLogout = () => {
    console.log("logout");
    if (typeof window !== 'undefined') {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("id");
    }
    router.push('/login');
    toast.success(`Logged out successfully!`);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#f26101",
        borderRadius: "4px 4px 0 0",
        height: "60px",
        width: "100%",
      }}
    >
      <Image
        src="https://collive.com/wp-content/uploads/awpcp/images/logo-stacked-96fbd396-large.png"
        alt="logo"
        width={100}
        height={50}

        style={{
          height: "50px",
          width: "100px",
        }}
      />
      <div
        style={{
          flex: "1",
          display: "flex",
          alignItems: "center",
          marginLeft: "5%",
          color: "white",
        }}
      >
        <div
          style={{
            color: "#11ec11",
            marginRight: "10px",
          }}
        >
          <i className="fa fa-circle" aria-hidden="true"></i>
        </div>
        <div>{props.room}</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end", // This will align the items to the right
          marginRight: "5%",
        }}
      >
        <button onClick={handleLogout} style={{
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#2979FF",
          color: "white",
          transition: "background-color 0.3s",
          outline: "none",
          marginLeft: "10px" // Adding some space between the icon and button
        }}>
          Logout
        </button>
      </div>

    </div>
  );
}

export default Header;
