package com.examly.springapp.service;

 
import java.util.List;

import org.springframework.stereotype.Service;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.repository.QuizRepository;

@Service
public class QuizService {
    private QuizRepository quizRepository;
    public QuizService(QuizRepository quizRepository){
        this.quizRepository =quizRepository;
    }
    public Quiz createQuiz(Quiz q){
        return quizRepository.save(q);
    }
    public List<Quiz> getAllQuiz(){
        return quizRepository.findAll();
    }
    public Quiz getQuizByID(Long id){
        return quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }
    public Quiz updateQuiz(Long id,Quiz q){
        q.setId(id);
        return quizRepository.save(q);
    }
    public void deleteQuiz(Long id){
        quizRepository.deleteById(id);
    }
}
