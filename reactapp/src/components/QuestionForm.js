import React,{ useState} from 'react';
import axios from 'axios';
function QuestionForm({quizId,onQuestionAdded}){
    const [questionText, setQuestionText]=useState('');
    const [questionType,setQuestionType]=useState('MULTIPLE_CHOICE');
    const [options, setOptions]=useState(['','','','']);
    const [correctOptionIndex, setCorrectOptionIndex]=useState(null);
    const [message, setMessage]=useState('');
    const [errors, setErrors]=useState([]);

    const handleOptionChange = (index, value)=>{
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };


    const validate = () => {
        const errs = [];

        if(questionText.trim().length<5||questionText.trim().length > 500){
            errs.push('Question text must be between 5 and 500 characters');
        }

        if(questionType === 'MULTIPLE_CHOICE'){
            const filled = options.filter(opt => opt.trim() !=='');
            if(filled.length < 2){
                errs.push('At least two options must be filled');
            }

            if(correctOptionIndex === null){
                errs.push('Please select the correct option');
            }
        }else{
            if(correctOptionIndex === null){
                errs.push('Please select True or False as the correct answer');
            }
        }
        return errs;
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrors([]);
        setMessage('');
        const validationErrors = validate();
        if(validationErrors.length>0){
            setErrors(validationErrors);
            return;
        }
        const payload = {
            questionText,
            questionType,
            options: questionType === 'MULTIPLE_CHOICE' ? options : ['True', 'False'],
            correctOptionIndex,
        };

        try{
            const response = await axios.post(`/api/quizzes/${quizId}/questions`,payload);

            if(!response.status||response.status === 200|| response.status === 201){
                setMessage('Question added!');
                setQuestionText('');
                setOptions(['','','','']);
                setCorrectOptionIndex(null);

                if(onQuestionAdded){
                    onQuestionAdded(response.data);
                }
            }else{
                setErrors(['Failed to add question']);
            }
        }catch{
            setErrors(['Server error']);
        }
    };

return (
    <div>
        <h2>Add Question to Quiz</h2>
        <form onSubmit={handleSubmit}>
        <div>
            <label>Question Text</label>
            <input
            id="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
            />
        </div>
        <div>
            <label>Question Type</label>
            <select
            id="questionType"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            >
                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                <option value="TRUE_FALSE">True/False</option>
            </select>
        </div>

        <div>
            <label>Options</label>
            {questionType === 'MULTIPLE_CHOICE'?(
                options.map((opt,idx)=>(
                    <div key={idx}>
                    <input
                       key={idx}
                       value={opt}
                       maxLength="200"
                       onChange={(e) => handleOptionChange(idx, e.target.value)}
                    />
                    <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionIndex==idx}
                    onChange={()=>setCorrectOptionIndex(idx)}
                    />
                    Correct
                    </div>
                ))
            ):(
               ['True','False'].map((val,idx)=>(
                <div key={val}>
                    <input value={val} readOnly />
                    <input
                    type="radio"
                    name="correctOption"
                    checked={correctOptionIndex==idx}
                    onChange={()=>setCorrectOptionIndex(idx)}
                    />
                    Correct
               </div>
               ))
               )}
               </div>
               <button type="submit">Add Question</button>

    </form>

    {
        errors.map((err,i)=>(
            <p key={i} style={{ color: 'red'}} > {err}</p>
        ))}
        {message && <p style={{color: 'green'}}>{message}</p>}
    </div>
    );
}
export default QuestionForm;
        