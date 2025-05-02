export default async function grabIncomingOrders(setter, organizationID){
  const backendURL = process.env.REACT_APP_BACKEND_SERVER_API_URL || "http://localhost:8080";
  const url = `${backendURL}/api/grabIncomingOrders/${organizationID}`;
  const data = await fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));
  console.log(data);
  setter(data);
}