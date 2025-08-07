import React,{ useEffect, useState } from "react";
import axios from 'axios';

function QuizForm({onQuizCreated}){

    const [quizzes, setQuizzes]=useState([]);
    const [validationErrors,setValidationErrors]=useState({});
    const [error,setError]=useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        timeLimit: '',
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

        const errors ={};

        if(formData.title.trim().length<3||formData.title.trim().length>100){
            errors.title='Quiz title must be between 3 and 100 characters';
        }
       
        if(!formData.timeLimit||isNaN(formData.timeLimit)){
            errors.timeLimit='Time limit must be a valid number';

        }
        if(Object.keys(errors).length>0){
            setValidationErrors(errors);
            return;
        }

        setValidationErrors({});
        try{
            await axios.post('/api/quizzes', formData);
            setSucess('Quiz created successfully!');
            setFormData({title:'',description:'',timeLimit:''});

            const res=await axios.get('/api/quizzes');
            setQuizzes(res.data);
            if(onQuizCreated){
                onQuizCreated();
            }
        }catch(err){
            const errorData=err.response?.data;
            if(errorData&&errorData.errors&&Array.isArray(errorData.errors)){
                setError(errorData.errors.join(', '));
            }
            else{
                setError('Something went wrong');
            }
        }
    };
    

    return(
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded">
            <h1 className="text-2xl font-bold mb-4">Create New Quiz</h1>
            {success && <p className="text-green-600 text-sm mb-2">{success}</p>}
            {/* {error && (<>{Array.isArray(error) ? (
                error.map((errMsg,idx)=>(
                    <p key={idx} className="text-red-500 text-sm mt-2">{errMsg}</p>
                ))
            ):( error&&<p className="text-red-500 text-sm mb-2">{error}</p>)}
            </> */}
            {error &&(
                <p className="text-red-500 text-sm mb-2">{error}</p>
            )}

            <form onSubmit={handleSubmit}>
                <label className="block text-grey-700">Title</label>
                <input 
                type="text" 
                id="title-input"
                name="title" 
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
                />
                {validationErrors.title  && <p className="text-red-500 text-sm mb-2">{validationErrors.title}</p>}
                <label className="block text-grey-700">Description</label>
                <input 
                type="text" 
                id="description-input"
                name="description" 
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                
                />
                {validationErrors.description  && <p className="text-red-500 text-sm mb-2">{validationErrors.description}</p>}
                <label className="block text-grey-700">Time Limit (minutes)</label>
                <input 
                type="number"
                id="timeLimit" 
                name="timeLimit" 
                value={formData.timeLimit}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
                required
                />
                {validationErrors.timeLimit  && <p className="text-red-500 text-sm mb-2">{validationErrors.timeLimit}</p>}

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