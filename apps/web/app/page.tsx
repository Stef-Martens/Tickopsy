export default async function IndexPage() {
  // Replace this with your Railway backend API URL
  const res = await fetch(
    "https://tickopsy-production.up.railway.app/accounts"
  );
  const users = await res.json();

  return (
    <div>
      <h1>Hello World</h1>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
