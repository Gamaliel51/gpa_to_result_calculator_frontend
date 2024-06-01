import {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const SignUp = (props) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)

        if(password !== password2){
            setError('Passwords are not the same')
            setPassword('')
            setPassword2('')
            setLoading(false)
            return
        }
        const formData = new FormData()
        formData.append('username', username)
        formData.append('password', password)
        axios.post(`/api/signup/`, formData)
        .then((res) => {
            setLoading(false)
            navigate('/login')
            return
        })
        .catch((err) => {
            setError(err.response.data.detail)
            setLoading(false)
            return
        })
    }

    if(loading){
        return(
            <div className="h-screen w-full flex flex-row items-center text-center text-[#FF9B00] bg-white">
                <p className='w-fit mx-auto text-3xl font-semibold'>Loading...</p>
            </div>
        )
    }

    return(
        <div className='h-screen w-full flex flex-col justify-center bg-[#eaecef]'>
            <form onSubmit={handleSubmit} className='h-3/6 w-1/4 mx-auto mt-14 flex flex-col justify-evenly shadow-2xl bg-white'>
                <h1 className='w-full text-center text-2xl font-semibold'>SignUp</h1>
                <div className='w-11/12 pl-4 mx-auto flex flex-row items-center justify-between'>
                    <input value={username} onChange={(e) => setUsername(e.target.value)} className='h-10 w-10/12 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white' id='username' name='username' placeholder='Username' type="text" />
                </div>
                <div className='w-11/12 pl-4 mx-auto flex flex-row items-center justify-between'>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} className='h-10 w-10/12 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white' id='password' name='password' placeholder='Enter password' type="password" />
                </div>
                <div className='w-11/12 pl-4 mx-auto flex flex-row items-center justify-between'>
                    <input value={password2} onChange={(e) => setPassword2(e.target.value)} className='h-10 w-10/12 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white' id='password2' name='password2' placeholder='Confirm password' type="password" />
                </div>
                <div className='w-full text-center text-red-500'>{error}</div>
                <button type='submit' className='h-14 w-3/5 mx-auto text-lg font-medium bg-[#FF9B00] hover:bg-[#e9aa57]'>SignUp</button>
            </form>
            <Link to={'/login'} className='w-1/12 mx-auto text-center mt-16 text-[#FF9B00]'>Login</Link>
        </div>
    )
}

export default SignUp
