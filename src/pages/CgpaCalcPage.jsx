import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const CgpaPage = (props) => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [possibleResults, setPossibleResults] = useState([])
    const [resultsIndex, setResultsIndex] = useState(0)

    const [cgpa, setCgpa] = useState('')
    const [totalmarks, setTotalMarks] = useState('')
    const [totalunits, setTotalUnits] = useState('')
    const [courses, setCourses] = useState([])
    const [newCourse, setNewCourse] = useState({code: '', name: '', units: ''})

    const [error, setError] = useState('')

    const addCourse = (event) => {
        event.preventDefault()
        const temp = courses
        temp.push({...newCourse, units: Number(newCourse.units)})
        setNewCourse({code: '', name: '', units: ''})
        setCourses(temp)
        return
    }

    const removeCourse = (event, index) => {
        event.preventDefault()
        const temp = courses
        temp.splice(index, 1)
        setNewCourse({code: '', name: '', units: ''})
        setCourses(temp)
        return
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setLoading(true)
        setError('')
        const config = {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            }
        }
        axios.post(`/api/cgpagenerate/`, {
            cgpa: cgpa, 
            total_marks: Number(totalmarks), 
            total_units: Number(totalunits), 
            courses: courses
        }, config)
        .then((res) => {
            if(res.data.status){
                setError(res.data.status)
                setLoading(false)
                return
            }
            setPossibleResults(res.data)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    const returnGrade = (grade) => {
        switch(grade){
            case 5:
                return "A"
            case 4:
                return "B"
            case 3:
                return "C"
            case 2:
                return "D"
            case 0:
                return "F"
        }
    }

    const saveResult = (result) => {
        const config = {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            }
        }
        const result_string = JSON.stringify({data: result})
        axios.post(`/api/saveresult/`, {result: result_string}, config)
        .then((res) => {
            if(res.data.status === 'ok'){
                window.alert('result saved')
            }
        })
        .catch((err) => {
            console.error(err)
        })
    }

    const exitWindow = () => {
        setPossibleResults([])
        return
    }

    useEffect(() => {
        setLoading(false)
    }, [possibleResults])

    if(loading){
        return(
            <div className="h-screen w-full flex flex-row items-center text-center text-[#FF9B00] bg-white">
                <p className='w-fit mx-auto text-3xl font-semibold'>Loading...</p>
            </div>
        )
    }

    if(possibleResults.length !== 0){
        return(
            <div className="min-h-screen w-full bg-[#eaecef]">
                <Navbar/>
                <div className="h-[85vh] w-10/12 mx-auto flex flex-row flex-wrap justify-center items-center">
                    <div className="h-[85%] w-10/12 mx-auto my-auto pt-5 overflow-y-auto rounded-lg border-solid border-gray-400 border-2 bg-white">
                        {possibleResults[resultsIndex].map((result) => {
                            return(
                                <div className="w-full pl-8 pb-4 mb-4 flex flex-row justify-evenly border-solid border-gray-400 border-b-2">
                                    <p className="w-1/5 text-start">{result.code}</p>
                                    <p className="w-2/5 text-start">{result.name}</p>
                                    <p className="w-1/5 text-center">{result.units}</p>
                                    <p className="w-1/5 text-center">{returnGrade(result.possible_grade)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <button onClick={(e) => saveResult(possibleResults[resultsIndex])} className='h-5/6 w-18 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Save Result</button>
                    <button onClick={(e) => exitWindow()} className='h-5/6 w-18 ml-1 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Esc View</button>
                    <div className="w-full flex flex-row justify-between">
                        <button onClick={(e) => setResultsIndex(resultsIndex - 1)} disabled={resultsIndex === 0} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Previous</button>
                        <div className="w-1/5 flex flex-row justify-evenly">
                            <input readOnly={true} value={resultsIndex + 1} onChange={(e) => setResultsIndex(Number(e.target.value) - 1)} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-white' />
                            <p>of</p>
                            <input type="text" readOnly={true} value={possibleResults.length} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-white'/>
                        </div>
                        <button onClick={(e) => setResultsIndex(resultsIndex + 1)} disabled={resultsIndex === (possibleResults.length - 1)} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Next</button>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="min-h-screen w-full bg-[#eaecef]">
            <Navbar/>
            <div className="h-[85vh] w-full flex flex-row flex-wrap justify-center items-center">
                <div className="h-full w-8/12 pt-5 flex flex-col bg-[#eaecef]">
                    <div className="h-fit w-11/12 flex flex-row justify-between">
                        <input type="text" value={cgpa} onChange={(e) => setCgpa(e.target.value)} placeholder="Enter Desired CGPA" className='h-10 w-1/5 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white'/>
                        <input type="text" value={totalmarks} onChange={(e) => setTotalMarks(e.target.value)} placeholder="Enter Total Marks" className='h-10 w-1/5 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white'/>
                        <input type="text" value={totalunits} onChange={(e) => setTotalUnits(e.target.value)} placeholder="Enter Total Units" className='h-10 w-1/5 mx-auto px-4 py-6 border-solid border-2 border-gray-400 rounded-lg bg-white'/>
                    </div>
                    <div className="h-[60vh] w-11/12 mx-auto mt-5 pt-5 overflow-y-auto rounded-lg border-solid border-gray-400 border-2 bg-white">
                        {courses.map((course, index) => {
                            return(
                                <div key={index} className="w-11/12 h-11 mx-auto flex flex-row mb-4 bg-[#ffc56e]">
                                    <p className="h-full w-1/5 px-4 py-1 text-center">{course.code}</p>
                                    <input type="text"  value={course.name} readOnly className="w-4/5 text-center bg-[#FF9B00]"/>
                                    <p className="h-full w-1/5 px-4 py-1 text-center">{course.units}</p>
                                    <button onClick={(e) => removeCourse(e, index)} className='h-full w-1/5 px-4 py-1 mx-auto my-auto text-center bg-[#FF9B00] hover:bg-blue-300' >remove</button>
                                </div>
                            )
                        })}
                    </div>
                    <div className="w-11/12 h-11 mx-auto flex flex-row justify-evenly my-4">
                        <input type="text"  value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} className="w-32 px-4 py-2 rounded-lg bg-white" placeholder="course code"/>
                        <input type="text"  value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} className="w-80 px-4 py-2 rounded-lg bg-white"placeholder="course title"/>
                        <input type="text"  value={newCourse.units} onChange={(e) => setNewCourse({...newCourse, units: e.target.value})} className="w-24 px-4 py-2 rounded-lg bg-white" placeholder="Units"/>
                        <button onClick={(e) => addCourse(e)} className='h-full w-32 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Add course</button>
                    </div>
                    <p className="w-full font-semibold text-center text-red-600">{error}</p>
                </div>
                <button onClick={(e) => handleSubmit(e)} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Generate</button>
            </div>
        </div>
    )
}

export default CgpaPage