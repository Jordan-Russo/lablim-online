export default async function grabTestReport(orderID){
  const backendURL = process.env.REACT_APP_BACKEND_SERVER_API_URL || "http://localhost:8080";
  const url = `${backendURL}/api/grabTestReport/${orderID}`;
  const orderData = await fetch(url)
    .then(res => res.json())
    .catch(err => console.log(err));
  console.log(orderData);
  return new Promise((resolve, reject) => {resolve(orderData)});
}