//package com.examly.springapp.controller;
//
//import com.examly.springapp.model.Quiz;
//import com.examly.springapp.model.Question;
//import com.examly.springapp.service.QuizService;
//import com.examly.springapp.service.QuestionService;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.http.ResponseEntity;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/quiz")
//@CrossOrigin(origins = "http://localhost:3000")
//public class QuizController {
//
//    private final QuizService quizService;
//    private final QuestionService questionService;
//
//    public QuizController(QuizService quizService, QuestionService questionService) {
//        this.quizService = quizService;
//        this.questionService = questionService;
//    }
//
//    @GetMapping("/all")
//    public List<Quiz> getAllQuizzes() {
//        return quizService.getAllQuizzes();
//    }
//
//    @PostMapping("/create")
//    public Quiz createQuiz(@RequestBody Quiz quiz) {
//        List<Question> questionEntities = quiz.getQuestions().stream()
//                .map(q -> questionService.getQuestionById(q.getId()))
//                .collect(Collectors.toList());
//        quiz.setQuestions(questionEntities);
//        return quizService.createQuiz(quiz);
//    }
//
//    @PutMapping("/update/{id}")
//    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
//        return quizService.updateQuiz(id, quiz);
//    }
//
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
//        if (!quizService.existsById(id)) {
//            return ResponseEntity.status(404).body("Quiz not found");
//        }
//        quizService.deleteUserQuizAssignments(id);
//        quizService.deleteQuiz(id);
//        return ResponseEntity.ok("Quiz deleted successfully");
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
//        try {
//            Quiz quiz = quizService.getQuizById(id);
//            return ResponseEntity.ok(quiz);
//        } catch (RuntimeException e) {
//            return ResponseEntity.status(410).body(null); // Gone status for expired quiz
//        }
//    }
//}
package com.examly.springapp.controller;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.Question;
import com.examly.springapp.service.QuizService;
import com.examly.springapp.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quiz")
@CrossOrigin(origins = "http://localhost:3000")
public class QuizController {

    private final QuizService quizService;
    private final QuestionService questionService;

    public QuizController(QuizService quizService, QuestionService questionService) {
        this.quizService = quizService;
        this.questionService = questionService;
    }

    @GetMapping("/all")
    public List<Quiz> getAllQuizzes() {
        return quizService.getAllQuizzes();
    }

    @PostMapping("/create")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        List<Question> questionEntities = quiz.getQuestions().stream()
                .map(q -> questionService.getQuestionById(q.getId()))
                .collect(Collectors.toList());
        quiz.setQuestions(questionEntities);
        return quizService.createQuiz(quiz);
    }

    @PutMapping("/update/{id}")
    public Quiz updateQuiz(@PathVariable Long id, @RequestBody Quiz quiz) {
        return quizService.updateQuiz(id, quiz);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteQuiz(@PathVariable Long id) {
        if (!quizService.existsById(id)) {
            return ResponseEntity.status(404).body("Quiz not found");
        }
        quizService.deleteUserQuizAssignments(id);
        quizService.deleteQuiz(id);
        return ResponseEntity.ok("Quiz deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getQuizById(@PathVariable Long id) {
        try {
            Quiz quiz = quizService.getQuizById(id);
            if (quiz.getDeadline().isBefore(LocalDateTime.now())) {
                return ResponseEntity.status(410).body(Map.of("error", "Quiz is no longer available due to passed deadline"));
            }

            Map<String, Object> response = new HashMap<>();
            response.put("id", quiz.getId());
            response.put("title", quiz.getTitle());
            response.put("description", quiz.getDescription());
            response.put("timeLimit", quiz.getTimeLimit());
            response.put("difficulty", quiz.getDifficulty().toString());
            response.put("category", quiz.getCategory() != null ? quiz.getCategory() : "Unknown");
            response.put("questions", quiz.getQuestions().stream().map(q -> {
                Map<String, Object> questionData = new HashMap<>();
                questionData.put("id", q.getId());
                questionData.put("text", q.getText()); // Maps to questionText in frontend
                questionData.put("options", q.getOptions());
                questionData.put("answer", q.getAnswer()); // Maps to correctAnswer in frontend
                return questionData;
            }).collect(Collectors.toList()));

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(Map.of("error", "Quiz not found"));
        }
    }
}