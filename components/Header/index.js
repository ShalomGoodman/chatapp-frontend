import React from "react";
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
        background: "#2979FF",
        borderRadius: "4px 4px 0 0",
        height: "60px",
        width: "100%",
      }}
    >
      <img 
        src="https://collive.com/wp-content/uploads/awpcp/images/logo-stacked-96fbd396-large.png" 
        style={{
          height: "50px",
          borderRadius: "10px",
          marginLeft: "10px",
          backgroundColor: "white",
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
          marginRight: "5%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <a href="/">
          <div
            style={{
              fontSize: "20px",
              color: "#fff",
            }}
          >
            <i className="fa fa-times-circle" aria-hidden="true"></i>
          </div>
        </a>
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>Logout</button>
      </div>
    </div>
  );
}

export default Header;
