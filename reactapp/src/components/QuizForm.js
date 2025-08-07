import React,{ useEffect, useState } from "react";
import axios from 'axios';

function QuizForm(){

    const [quizzes, setQuizzes]=useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: ' ',
    });
    const [success,setSucess] =useState('');
    useEffect(()=>{
        axios.get('/api/quizzes')
        .then(res => setQuizzes(res.data))
        .catch(err => console.error(err));
    },[]);
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]: e.target.value})
    };
    const handleSubmit=async (e) => {
        e.preventDefault();
        try{
            await axios.post('/api/quizzes', formData);
            setSucess('Quiz created successfully!');
            setFormData({title:'',description:'',timeLimit:''});

            const res=await axios.get('api/quizzes');
            setQuizzes(res.data);
        }catch(err){
            console.error(err);
        }
    };
    

    return(
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded">
            <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
            {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block text-grey-700">Title</label>
                <input 
                type="text" 
                name="title" 
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
                />
                <label className="block text-grey-700">Description</label>
                <input 
                type="text" 
                name="description" 
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
                />
                <label className="block text-grey-700">Time Limit (minutes)</label>
                <input 
                type="number" 
                name="timeLimit" 
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
                />

                <button type="submit" className="bg-blue-500-white px-4 py-2">Create Quiz</button>
            </form>

            <ul className="mt-4">
                {quizzes.map((quiz, index)=>(
                    <li key={index}>{quiz.title}</li>
                ))}
            </ul>
        </div>
    );
}
export default QuizForm;