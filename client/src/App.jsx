import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [test, setTest] = useState("Checking API...");

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await axios.get("/api/test");
        setTest(response.data.message);
      } catch {
        setTest("API is not reachable. Start the backend server.");
      }
    };

    checkApi();
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center p-8 text-center">
      <h1 className="mb-4 text-4xl font-bold text-slate-900">
        ChatLingo MERN Starter
      </h1>
      <p className="text-slate-700">Frontend: React + Vite + Tailwind</p>
      <p className="text-slate-700">Backend: Node + Express + MongoDB</p>
      <p className="mt-4 rounded-lg bg-slate-100 p-3 text-slate-800">
        API status: <strong>{test}</strong>
      </p>
    </main>
  );
}

export default App;
