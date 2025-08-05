package com.examly.springapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.QuizAttemptDTO;
import com.examly.springapp.service.QuizAttemptService;

@RestController
@RequestMapping("/api")
public class QuizAttemptController {
    private final QuizAttemptService attemptService;

    public QuizAttemptController(QuizAttemptService attemptService){
        this.attemptService=attemptService;
    }
    @PostMapping("/quiz-attempts")
    public ResponseEntity<QuizAttemptDTO> submitQuizAttempt(@RequestBody QuizAttemptDTO quizattemptdto){
        QuizAttemptDTO result=attemptService.submitQuizAttempt(quizattemptdto);
        return new ResponseEntity<>(result,HttpStatus.CREATED);
    }

    @GetMapping("/quizzes/{quizId}/attempts")
    public ResponseEntity<QuizAttemptDTO[]> getQuizAttempts(@PathVariable Long quizId){
        List<QuizAttemptDTO> attempts=attemptService.getAttemptByQuizId(quizId);
        QuizAttemptDTO[] result=attempts.toArray(new QuizAttemptDTO[0]);
        return ResponseEntity.ok(result);
    }
}
