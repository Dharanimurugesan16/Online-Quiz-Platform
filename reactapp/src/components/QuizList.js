import axios from "axios";
import { resolve } from "karma/lib/plugin";
import React,{ useEffect, useState } from "react";

function QuizList({onSelectQuiz}){
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(()=>{
    const fetchData=async()=>{
        try{
            
            const response = await axios.get('/api/quizzes');
            setQuizzes(response.data);
        }catch (err){
            console.error('Error fetching quizzes:',err);
            setError('Failed to fetch quizzes');
        }finally{
            setLoading(false);
        }
    };
    fetchData();
},
[]);
if(loading){
    return <p>Loading quizzes</p>;
}
if(error){
    return <p>{error}</p>
}
    return(
        <div>
            <h2>Available Quizzes</h2>
            {quizzes.length===0?(
                <p>No quizzes available</p>
            ):(
            <ul>
                {quizzes.map((quiz)=>(
                    <li key={quiz.id}
                    onClick={()=>onSelectQuiz?.(quiz.id)}
                    style={{cursor:'pointer'}}
                    >{quiz.title}</li>
                ))}
            </ul>

            )}
        </div>
    );
}
export default QuizList;