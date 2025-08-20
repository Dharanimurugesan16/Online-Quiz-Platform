package com.examly.springapp.controller;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.QuizAttempt;
import com.examly.springapp.model.Question;
import com.examly.springapp.service.QuizAttemptService;
import com.examly.springapp.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz-attempt")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;
    private final QuizService quizService;

    public QuizAttemptController(QuizAttemptService quizAttemptService, QuizService quizService) {
        this.quizAttemptService = quizAttemptService;
        this.quizService = quizService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> saveQuizAttempt(@RequestBody QuizAttempt quizAttempt) {
        try {
            QuizAttempt savedAttempt = quizAttemptService.saveQuizAttempt(quizAttempt);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("attemptId", savedAttempt.getAttemptId());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getUserQuizAttempts(@PathVariable String userId) {
        try {
            List<QuizAttempt> attempts = quizAttemptService.getUserQuizAttempts(userId);
            List<Map<String, Object>> response = attempts.stream().map(attempt -> {
                Quiz quiz = quizService.getQuizById(attempt.getQuizId());
                Map<String, Object> attemptData = new HashMap<>();
                attemptData.put("attemptId", attempt.getAttemptId());
                attemptData.put("quizId", attempt.getQuizId());
                attemptData.put("quizTitle", quiz.getTitle());
                attemptData.put("quizDescription", quiz.getDescription());
                attemptData.put("answers", attempt.getAnswers());
                attemptData.put("score", Math.round((double) attempt.getScore() / attempt.getTotalQuestions() * 100));
                attemptData.put("totalQuestions", attempt.getTotalQuestions());
                attemptData.put("correctAnswers", attempt.getScore());
                attemptData.put("timeSpent", attempt.getTimeSpent());
                attemptData.put("completedDate", attempt.getCompletedDate().toString());
                attemptData.put("difficulty", quiz.getDifficulty().toString());
                attemptData.put("category", quiz.getCategory() != null ? quiz.getCategory() : "Unknown");
                attemptData.put("attempts", attempt.getAttempts());
                return attemptData;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(List.of(Map.of("error", e.getMessage())));
        }
    }

    @GetMapping("/attempt/{attemptId}")
    public ResponseEntity<Map<String, Object>> getQuizAttemptById(@PathVariable Long attemptId) {
        try {
            QuizAttempt attempt = quizAttemptService.getQuizAttemptById(attemptId);
            Quiz quiz = quizService.getQuizById(attempt.getQuizId());

            Map<String, Object> response = new HashMap<>();
            response.put("attemptId", attempt.getAttemptId());
            response.put("quizId", attempt.getQuizId());
            response.put("quizTitle", quiz.getTitle());
            response.put("quizDescription", quiz.getDescription());
            response.put("questions", quiz.getQuestions().stream().map(q -> {
                Map<String, Object> questionData = new HashMap<>();
                questionData.put("id", q.getId());
                questionData.put("questionText", q.getText()); // Map text to questionText
                questionData.put("options", q.getOptions());
                questionData.put("correctAnswer", q.getAnswer()); // Map answer to correctAnswer
                QuizAttempt.AnswerDetails answerDetails = attempt.getAnswers().get(String.valueOf(q.getId()));
                questionData.put("selectedAnswer", answerDetails != null ? answerDetails.getSelectedAnswer() : null);
                return questionData;
            }).collect(Collectors.toList()));
            response.put("score", attempt.getScore());
            response.put("totalQuestions", attempt.getTotalQuestions());
            response.put("timeSpent", attempt.getTimeSpent());
            response.put("completedDate", attempt.getCompletedDate().toString());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}