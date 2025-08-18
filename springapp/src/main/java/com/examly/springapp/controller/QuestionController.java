//package com.examly.springapp.controller;
//
//import java.util.List;
//
//import java.util.stream.Collectors;
//
//import org.springframework.http.HttpStatus;
//    import org.springframework.http.ResponseEntity;
//    import org.springframework.web.bind.annotation.DeleteMapping;
//    import org.springframework.web.bind.annotation.GetMapping;
//    import org.springframework.web.bind.annotation.PathVariable;
//    import org.springframework.web.bind.annotation.PostMapping;
//    import org.springframework.web.bind.annotation.PutMapping;
//    import org.springframework.web.bind.annotation.RequestBody;
//    import org.springframework.web.bind.annotation.RequestMapping;
//    import org.springframework.web.bind.annotation.RestController;
//
//import com.examly.springapp.dto.ErrorResponse;
//import com.examly.springapp.dto.OptionDTO;
//import com.examly.springapp.dto.QuestionDTO;
//import com.examly.springapp.model.Option;
//import com.examly.springapp.model.Question;
//    import com.examly.springapp.service.QuestionService;
//
//
//    import jakarta.validation.Valid;
//
//    @RestController
//    @RequestMapping("/api")
//    public class QuestionController {
//        private final QuestionService questionservice;
//
//        public QuestionController(QuestionService questionservice){
//            this.questionservice = questionservice;
//        }
//
//        @GetMapping("/questions")
//        public ResponseEntity<List<Question>> getAllQuestions(){
//            List<Question> questions=questionservice.getAllQuestions();
//            return ResponseEntity.ok(questions);
//        }
//
//        @GetMapping("/questions/{id}")
//        public ResponseEntity<Question> getQuestionBYId(@PathVariable Long id){
//            Question question = questionservice.getQuestionByID(id);
//            return ResponseEntity.ok(question);
//        }
//        @PostMapping("/quizzes/{quizId}/questions")
//        public ResponseEntity<?> addQuestionToQuiz
//        (@PathVariable Long quizId,@Valid @RequestBody QuestionDTO questiondto){
//
//            String normalizedType=questiondto.getQuestionType().replace("_"," ").toUpperCase();
//
//            long correctCount=questiondto.getOptions().stream()
//                                    .filter(OptionDTO::getIsCorrect)
//                                    .count();
//
//            if((!normalizedType.equals("MULTIPLE CHOICE") && !normalizedType.equals("TRUE FALSE"))||correctCount!=1){
//                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                                .body(new ErrorResponse(
//                                HttpStatus.BAD_REQUEST.value(),
//                                "Validation Failed",
//                                List.of("Each question must have exactly one correct option")));
//            }
//            Question question=new Question();
//            question.setQuestionText(questiondto.getQuestionText());
//            question.setQuestionType(questiondto.getQuestionType());
//
//            List<Option> optionEntities = questiondto.getOptions().stream().map(optDTO->{
//                Option option=new Option();
//                option.setOptionText(optDTO.getOptionText());
//                option.setIsCorrect(optDTO.getIsCorrect());
//                option.setQuestion(question);
//                return option;
//            }).collect(Collectors.toList());
//
//            question.setOptions(optionEntities);
//            if(!questionservice.quixExists(quizId)){
//                return ResponseEntity.status(HttpStatus.NOT_FOUND)
//                .body(new ErrorResponse(HttpStatus.NOT_FOUND.value(), "Quiz Not Found" ,List.of("Quiz not found")));
//            }
//            Question savedQuestion=questionservice.addQuestionToQuiz(quizId, question);
//
//            QuestionDTO responseDTO=new QuestionDTO();
//            responseDTO.setId(savedQuestion.getId());
//            responseDTO.setQuestionText(savedQuestion.getQuestionText());
//            responseDTO.setQuestionType(savedQuestion.getQuestionType());
//
//            List<OptionDTO> responseOptions=savedQuestion.getOptions().stream().map(opt->{
//                OptionDTO dto=new OptionDTO();
//                dto.setOptionText(opt.getOptionText());
//                dto.setIsCorrect(opt.getIsCorrect());
//                return dto;
//            }
//            ).collect(Collectors.toList());
//
//            responseDTO.setOptions(responseOptions);
//            return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
//        }
//
//        @PutMapping("/questions/{id}")
//        public ResponseEntity<Question> updateQuestion(@PathVariable Long id,@Valid @RequestBody Question updatedquestion){
//            Question question = questionservice.updateQuestion(id, updatedquestion);
//            return ResponseEntity.ok(question);
//        }
//
//        @DeleteMapping("/questions/{id}")
//        public ResponseEntity<Void> deleteQuestion(@PathVariable Long id){
//            questionservice.deleteQuestion(id);
//            return ResponseEntity.noContent().build();
//        }
//
//    }
//package com.examly.springapp.controller;
//
//import com.examly.springapp.model.Question;
//import com.examly.springapp.service.QuestionService;
//import org.springframework.web.bind.annotation.*;
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/question")
//@CrossOrigin(origins = "http://localhost:3000")
//public class QuestionController {
//
//    private final QuestionService questionService;
//
//    public QuestionController(QuestionService questionService) {
//        this.questionService = questionService;
//    }
//
//    @GetMapping("/all")
//    public List<Question> getAllQuestions() {
//        return questionService.getAllQuestions();
//    }
//
//    @PostMapping("/create")
//    public Question createQuestion(@RequestBody Question question) {
//        return questionService.createQuestion(question);
//    }
//
//    @PutMapping("/update/{id}")
//    public Question updateQuestion(@PathVariable Long id, @RequestBody Question question) {
//        return questionService.updateQuestion(id, question);
//    }
//
//    @DeleteMapping("/delete/{id}")
//    public void deleteQuestion(@PathVariable Long id) {
//        questionService.deleteQuestion(id);
//    }
//}
package com.examly.springapp.controller;

import com.examly.springapp.model.Question;
import com.examly.springapp.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/question")
@CrossOrigin(origins = "http://localhost:3000")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Question>> getAllQuestions() {
        List<Question> questions = questionService.getAllQuestions();
        return ResponseEntity.ok(questions);
    }

    @PostMapping("/create")
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        Question savedQuestion = questionService.createQuestion(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateQuestion(@PathVariable Long id, @RequestBody Question question) {
        try {
            Question updatedQuestion = questionService.updateQuestion(id, question);
            return ResponseEntity.ok(updatedQuestion);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Question not found");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteQuestion(@PathVariable Long id) {
        try {
            questionService.deleteQuestion(id);
            return ResponseEntity.ok("Question deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Question not found or could not be deleted");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuestionById(@PathVariable Long id) {
        try {
            Question question = questionService.getQuestionById(id);
            return ResponseEntity.ok(question);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("Question not found");
        }
    }
}
