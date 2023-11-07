import { useCallback } from "react";
import "./App.css";
import { useConnection } from "./hooks/useConnection";
import logo from "./logo.svg";

function App() {
  const { status, fetchData } = useConnection();

  const startTransmission = useCallback(async () => {
    const data = await fetchData();

    console.log(data);
  }, [fetchData]);

  return (
    <div className="App">
      {status === "connected" && (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p onClick={startTransmission}>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      )}
      {status === "loading" && <p>Establishing connection...</p>}
      {status === "failed" && (
        <p>Failed to establish a connection with backend service</p>
      )}
    </div>
  );
}

export default App;
