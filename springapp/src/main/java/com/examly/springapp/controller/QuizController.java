package com.examly.springapp.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.examly.springapp.dto.QuizDTO;
import com.examly.springapp.model.Quiz;
import com.examly.springapp.service.QuizService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/quizzes")
public class QuizController {
    private final QuizService quizservice;
    public QuizController(QuizService quizservice){
        this.quizservice = quizservice;
    }
    @GetMapping
    public List<Quiz> getQuiz(){
        return quizservice.getAllQuiz();
    }
    @GetMapping("/{id}")
    public Quiz getQuizbyId(@PathVariable Long id){
        return quizservice.getQuizByID(id);
    }
    @PostMapping
    public ResponseEntity<QuizDTO> postQuiz(@Valid @RequestBody QuizDTO quizDTO){
        Quiz quiz = Quiz.builder()   
                    .title(quizDTO.getTitle())
                    .description(quizDTO.getDescription())
                    .timeLimit(quizDTO.getTimeLimit())
                    .createdAt(LocalDateTime.now())
                    .build();
        Quiz savedQuiz=quizservice.createQuiz(quiz);
        QuizDTO responseDTO= new QuizDTO();
        responseDTO.setId(savedQuiz.getId());
        responseDTO.setTitle(savedQuiz.getTitle());
        responseDTO.setDescription(savedQuiz.getDescription());
        responseDTO.setTimeLimit(savedQuiz.getTimeLimit());
        responseDTO.setCreatedAt(savedQuiz.getCreatedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }
    @PutMapping("/put/{id}")
    public Quiz putQuiz(@PathVariable Long id,@RequestBody Quiz q){
        return quizservice.updateQuiz(id, q);
    }
    @DeleteMapping("/delete/{id}")
    public void deleteQuiz(@PathVariable Long id){
        quizservice.deleteQuiz(id);
    }
}
