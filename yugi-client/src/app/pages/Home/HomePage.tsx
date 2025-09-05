import { useEffect, useState } from "react";

export default function HomePage() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Pretpostavljamo da si prilikom registracije/logina čuvao username u localStorage
    const storedName = localStorage.getItem("username");
    setUsername(storedName);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Welcome{username ? `, ${username}` : ""}!</h1>
      <p>This is your home page.</p>
    </div>
  );
}
