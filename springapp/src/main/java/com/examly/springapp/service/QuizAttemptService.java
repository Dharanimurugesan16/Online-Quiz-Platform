package com.examly.springapp.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.examly.springapp.dto.AnswerDTO;
import com.examly.springapp.dto.QuizAttemptDTO;
import com.examly.springapp.model.Option;
import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.QuizAttempt;
import com.examly.springapp.repository.OptionRepository;

import com.examly.springapp.repository.QuizAttemptRepository;
import com.examly.springapp.repository.QuizRepository;

@Service
public class QuizAttemptService {
    private final QuizAttemptRepository quizAttemptrepo;
    private final QuizRepository quizrepo;
    
    private final OptionRepository optionrepo;
    
    public QuizAttemptService (
        QuizAttemptRepository quizAttemptrepo,
        QuizRepository quizrepo,
        OptionRepository optionrepo){
        this.quizAttemptrepo=quizAttemptrepo;
        this.quizrepo=quizrepo;
        this.optionrepo=optionrepo;
    }
    public QuizAttemptDTO submitQuizAttempt(QuizAttemptDTO attemptDTO){
        Quiz quiz=quizrepo.findById(attemptDTO.getQuizId())
                .orElseThrow(()->new RuntimeException("Quiz not found"));

        int totalQuestions=0;
        int score=0;
        
        for(AnswerDTO answer:attemptDTO.getAnswers()){
            totalQuestions++;

            Option selectedoption=optionrepo.findById(answer.getSelectedOptionId())
                                .orElseThrow(()->new RuntimeException("Selected option not found"));

            if(selectedoption.getIsCorrect()){
                score++;
            }
        }

        QuizAttempt attempt=new QuizAttempt();
        attempt.setQuiz(quiz);
        attempt.setStudentName(attemptDTO.getStudentName());
        attempt.setScore(score);
        attempt.setTotalQuestions(totalQuestions);
        attempt.setCompletedAt(LocalDateTime.now());
        
        quizAttemptrepo.save(attempt);
        
        attemptDTO.setScore(score);
        attemptDTO.setTotalQuestions(totalQuestions);
        attemptDTO.setCompletedAt(attempt.getCompletedAt());

        return attemptDTO;
    }
    public List<QuizAttemptDTO> getAttemptByQuizId(Long quizId){
        List<QuizAttempt> attempts=quizAttemptrepo.findByQuizId(quizId);

        return attempts.stream().map(attempt->{
            QuizAttemptDTO dto=new QuizAttemptDTO();
            dto.setQuizId(attempt.getQuiz().getId());
            dto.setStudentName(attempt.getStudentName());
            dto.setScore(attempt.getScore());
            dto.setTotalQuestions(attempt.getTotalQuestions());
            dto.setCompletedAt(attempt.getCompletedAt());
            return dto;
        }).collect(Collectors.toList());
    }
}
