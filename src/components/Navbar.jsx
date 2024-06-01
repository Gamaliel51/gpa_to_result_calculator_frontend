import { Link, useNavigate } from "react-router-dom"


const Navbar = () => {

    const navigate = useNavigate()

    const logOut = () => {
        sessionStorage.removeItem('accessToken')
        navigate('/login')
    }

    return(
        <nav className="w-full h-20 flex flex-row justify-between bg-white">
            <div className="h-full w-2/12 flex items-center pl-4">
                <img src="/src/assets/result.png" alt="" className="h-16 rounded-full" />
            </div>
            <div className="h-full w-9/12 px-20 pt-6 flex flex-row justify-end">
                <Link className="hover:text-blue-500" to={"/"}>GPA</Link>
                <Link className="hover:text-blue-500 ml-24" to={"/cgpa"}>CGPA</Link>
                <Link className="hover:text-blue-500 ml-24" to={"/saved"}>Saved Results</Link>
                <div onClick={() => logOut()} className="hover:text-blue-500 cursor-pointer ml-24">LogOut</div>  
            </div>
        </nav>
    )
}


export default Navbar