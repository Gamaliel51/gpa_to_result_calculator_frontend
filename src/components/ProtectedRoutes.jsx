import { useEffect } from "react"
import { checkAuth } from "../utility"
import { useNavigate } from "react-router-dom"




const ProtectedRoute = (props) => {

    const navigate = useNavigate()

    useEffect(() => {
        if(checkAuth()){
            return
        }
        else{
            navigate('/login')
        }
    }, [])

    return(
        <>{props.children}</>
    )
}

export default ProtectedRoute