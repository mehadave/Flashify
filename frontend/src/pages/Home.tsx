import { useEffect, useState } from "react";
import { getHealth } from "../services/api";

function Home() {
  const [status, setStatus] = useState("loading...");

  useEffect(() => {
    getHealth()
      .then((data) => setStatus(data.status))
      .catch(() => setStatus("backend not reachable"));
  }, []);

  return (
    <div>
      <h1> Frontend ↔ Backend Test </h1>
      <p> Backend status: {status}</p>
    </div>
  );
}

export default Home;
