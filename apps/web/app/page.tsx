"use client";

import { useEffect, useState } from "react";

export default function IndexPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://tickopsy-production.up.railway.app/accounts")
      .then((res) => res.json())
      .then(setUsers);
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}

// test
