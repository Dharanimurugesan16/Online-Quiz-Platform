//package com.examly.springapp.service;
//
//
//import java.util.List;
//
//import org.springframework.stereotype.Service;
//
//import com.examly.springapp.model.Quiz;
//import com.examly.springapp.repository.QuizRepository;
//
//@Service
//public class QuizService {
//    private QuizRepository quizRepository;
//    public QuizService(QuizRepository quizRepository){
//        this.quizRepository =quizRepository;
//    }
//    public Quiz createQuiz(Quiz q){
//        return quizRepository.save(q);
//    }
//    public List<Quiz> getAllQuiz(){
//        return quizRepository.findAll();
//    }
//    public Quiz getQuizByID(Long id){
//        return quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
//    }
//    public Quiz updateQuiz(Long id,Quiz q){
//        q.setId(id);
//        return quizRepository.save(q);
//    }
//    public void deleteQuiz(Long id){
//        quizRepository.deleteById(id);
//    }
//}
//package com.examly.springapp.service;
//
//import com.examly.springapp.model.Quiz;
//import com.examly.springapp.repository.QuizRepository;
//import org.springframework.stereotype.Service;
//import java.util.List;
//
//@Service
//public class QuizService {
//    private final QuizRepository quizRepository;
//    private UserQuizRepository userQuizRepository;
//
//    public QuizService(QuizRepository quizRepository) {
//        this.quizRepository = quizRepository;
//        this.userQuizRepository = userQuizRepository;
//    }
//
//    public Quiz createQuiz(Quiz quiz) {
//        return quizRepository.save(quiz);
//    }
//
//    public Quiz updateQuiz(Long id, Quiz quizDetails) {
//        Quiz quiz = quizRepository.findById(id).orElseThrow();
//        quiz.setTitle(quizDetails.getTitle());
//        quiz.setDescription(quizDetails.getDescription());
//        quiz.setTimeLimit(quizDetails.getTimeLimit());
//        quiz.setQuestions(quizDetails.getQuestions());
//        return quizRepository.save(quiz);
//    }
//
//    public void deleteQuiz(Long id) {
//        quizRepository.deleteById(id);
//    }
//    public void deleteUserQuizAssignments(Long quizId) {
//        userQuizRepository.deleteByQuizId(quizId);
//    }
//
//    public List<Quiz> getAllQuizzes() {
//        return quizRepository.findAll();
//    }
//
//    public Quiz getQuizById(Long id) {
//        return quizRepository.findById(id).orElseThrow();
//    }
//
//
//
//}
package com.examly.springapp.service;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.repository.QuizRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final JdbcTemplate jdbcTemplate;

    public QuizService(QuizRepository quizRepository, JdbcTemplate jdbcTemplate) {
        this.quizRepository = quizRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id).orElseThrow();
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setTimeLimit(quizDetails.getTimeLimit());
        quiz.setQuestions(quizDetails.getQuestions());
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    public void deleteUserQuizAssignments(Long quizId) {
        String sql = "DELETE FROM user_quiz WHERE quiz_id = ?";
        jdbcTemplate.update(sql, quizId);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElseThrow();
    }

    public boolean existsById(Long id) {
        return quizRepository.existsById(id);
    }

}
