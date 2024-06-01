import { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const SavedResults = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [checked, setChecked] = useState(false)
    const [deleteRec, setDeleteRec] = useState(false)

    const [resultString, setResultString] = useState('')
    const [possibleResults, setPossibleResults] = useState([])
    const [resultsIndex, setResultsIndex] = useState(0)

    const deleteResult = (result) => {

        const temp = possibleResults
        temp.splice(resultsIndex, 1)
        
        let tempstring = ""
        temp.map((item) => {
            const objString = JSON.stringify({data: item})
            tempstring += `;${objString}`
        })

        setPossibleResults(temp)
        setResultsIndex(0)
        setResultString(tempstring)
        setDeleteRec(true)
        return
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

    useEffect(() => {
        if(deleteRec){
            const config = {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
                }
            }
    
            axios.put(`/api/saveresult/`, {result: resultString}, config)
            .then((res) => {
                window.alert('record deleted')
                navigate('/saved')
            })
            .catch((err) => {
                console.error(err)
            })
            setDeleteRec(false)
        }
    }, [resultString])

    useEffect(() => {
        setLoading(true)
        const config = {
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
            }
        }
        axios.get(`/api/saveresult/`, config)
        .then((res) => {
            const data = res.data.data
            const stringArrayTemp = data.split(";")
            const stringArray = stringArrayTemp.slice(1)

            const temp = stringArray.map((item) => {
                if(item !== ""){
                    const obj = JSON.parse(item)
                    return obj.data
                }
            })

            setPossibleResults(temp)
            setResultString(data)
            setChecked(true)
        })
        .catch((err) => {
            console.error(err)
        })
    }, [])

    if(possibleResults.length === 0 && checked === true){
        return(
            <div className="h-screen w-full flex flex-col items-center text-center text-[#FF9B00] bg-white">
                <Navbar/>
                <p className='w-fit h-fit my-auto mx-auto text-3xl font-semibold'>No Saved Results</p>
            </div>
        )
    }

    if(possibleResults.length === 0){
        return(
            <div className="h-screen w-full flex flex-row items-center text-center text-[#FF9B00] bg-white">
                <p className='w-fit mx-auto text-3xl font-semibold'>Loading...</p>
            </div>
        )
    }

    return(
        <div className="min-h-screen w-full bg-[#eaecef]">
            <Navbar/>
            <div className="h-[85vh] w-10/12 mx-auto flex flex-row flex-wrap justify-center items-center">
                <div className="h-[85%] w-10/12 mx-auto my-auto pt-5 overflow-y-auto rounded-lg border-solid border-gray-400 border-2 bg-white">
                    {possibleResults[resultsIndex].map((result, key) => {
                        return(
                            <div key={key} className="w-full pl-8 pb-4 mb-4 flex flex-row justify-evenly border-solid border-gray-400 border-b-2">
                                <p className="w-1/5 text-start">{result.code}</p>
                                <p className="w-2/5 text-start">{result.name}</p>
                                <p className="w-1/5 text-center">{result.units}</p>
                                <p className="w-1/5 text-center">{returnGrade(result.possible_grade)}</p>
                            </div>
                        )
                    })}
                </div>
                <button onClick={(e) => deleteResult(possibleResults[resultsIndex])} className='h-5/6 w-18 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Delete Result</button>
                <div className="w-full flex flex-row justify-between">
                    <button onClick={(e) => setResultsIndex(resultsIndex - 1)} disabled={resultsIndex === 0} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Previous</button>
                    <input readOnly={true} value={resultsIndex + 1} onChange={(e) => setResultsIndex(Number(e.target.value) - 1)} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-white' />
                    <button onClick={(e) => setResultsIndex(resultsIndex + 1)} disabled={resultsIndex === (possibleResults.length - 1)} className='h-5/6 w-24 px-4 py-1 my-auto text-center rounded-md bg-[#FF9B00] hover:bg-[#e9aa57]' >Next</button>
                </div>
            </div>
        </div>
    )
}


export default SavedResults
