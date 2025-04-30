import { useNavigate, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/Auth";
import { useState, useEffect } from "react";
import { supabaseClient as supabase } from "../config/supabase-client";

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const [permission, setPermission] = useState('');
    const location = useLocation();
    const userID = user?.id

    // eslint-disable-next-line
    useEffect(() => {getInfo()}, [permission])
    if (!user) {
        // user is not authenticated
        return navigate("/login")
    }

    
    async function getInfo(){
        let { data } = await supabase
        .from('Names')
        .select('name')
        .eq('user_id', userID)
        
        const hasName = data?.length > 0

        if (!hasName) {
            setPermission('must create name first')
        }else{
            setPermission('authorized')
        }
    }

    if(permission === 'must create name first' && location.pathname !== '/create-name'){
        return <Navigate to='/create-name' />
    }else{
        return <>{children}</>
    }
};

export default ProtectedRoute