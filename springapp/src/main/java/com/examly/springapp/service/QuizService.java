package com.examly.springapp.service;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.repository.QuizRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
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
        quiz.setCreatedAt(LocalDateTime.now());
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setTimeLimit(quizDetails.getTimeLimit());
        quiz.setQuestions(quizDetails.getQuestions());
        quiz.setDifficulty(quizDetails.getDifficulty());
        quiz.setDeadline(quizDetails.getDeadline());
        quiz.setUpdatedAt(LocalDateTime.now());
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
        Quiz quiz = quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
        if (quiz.getDeadline().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Quiz is no longer available due to passed deadline");
        }
        return quiz;
    }

    public boolean existsById(Long id) {
        return quizRepository.existsById(id);
    }
}