import { useAuth } from "../hooks/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Logout() {
  const { signOut } = useAuth()
  let navigate = useNavigate();
  useEffect(() => {
    signOut()
    navigate('/')
  }, [navigate, signOut])
}