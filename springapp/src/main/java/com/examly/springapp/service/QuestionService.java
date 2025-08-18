//    package com.examly.springapp.service;
//
//    import java.util.List;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.stereotype.Service;
//import org.springframework.web.server.ResponseStatusException;
//
//import com.examly.springapp.model.Question;
//    import com.examly.springapp.model.Quiz;
//    import com.examly.springapp.repository.QuestionRepository;
//    import com.examly.springapp.repository.QuizRepository;
//
//    @Service
//    public class QuestionService {
//        private final QuizRepository quizRepository;
//        private final QuestionRepository questionRepository;
//
//        public QuestionService(QuizRepository quizRepository,QuestionRepository questionRepository){
//            this.quizRepository =quizRepository;
//            this.questionRepository=questionRepository;
//        }
//        public Question addQuestionToQuiz(Long quizId, Question question){
//            Quiz quiz=quizRepository.findById(quizId)
//            .orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Quiz not found"));
//            question.setQuiz(quiz);
//            return questionRepository.save(question);
//        }
//        public List<Question> getAllQuestions(){
//            return questionRepository.findAll();
//        }
//        public Question getQuestionByID(Long id){
//            return questionRepository.findById(id).orElseThrow(() -> new RuntimeException("Question not found"));
//        }
//        public Question updateQuestion(Long id,Question q){
//            q.setId(id);
//            return questionRepository.save(q);
//        }
//        public boolean quixExists(Long quizId){
//            return quizRepository.existsById(quizId);
//        }
//        public void deleteQuestion(Long id){
//            questionRepository.deleteById(id);
//        }
//    }
//package com.examly.springapp.service;
//
//import com.examly.springapp.model.Question;
//import com.examly.springapp.repository.QuestionRepository;
//import org.springframework.stereotype.Service;
//import java.util.List;
//
//@Service
//public class QuestionService {
//    private final QuestionRepository questionRepository;
//
//    public QuestionService(QuestionRepository questionRepository) {
//        this.questionRepository = questionRepository;
//    }
//
//    public Question createQuestion(Question question) {
//        return questionRepository.save(question);
//    }
//
//    public Question updateQuestion(Long id, Question questionDetails) {
//        Question question = questionRepository.findById(id).orElseThrow();
//        question.setText(questionDetails.getText());
//        question.setOptions(questionDetails.getOptions());
//        question.setAnswer(questionDetails.getAnswer());
//        return questionRepository.save(question);
//    }
//
//    public void deleteQuestion(Long id) {
//        questionRepository.deleteById(id);
//    }
//
//    public List<Question> getAllQuestions() {
//        return questionRepository.findAll();
//    }
//
//    public Question getQuestionById(Long id) {
//        return questionRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Question not found"));
//    }
//
//
//}
package com.examly.springapp.service;

import com.examly.springapp.model.Question;
import com.examly.springapp.repository.QuestionRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final JdbcTemplate jdbcTemplate;

    public QuestionService(QuestionRepository questionRepository, JdbcTemplate jdbcTemplate) {
        this.questionRepository = questionRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = questionRepository.findById(id).orElseThrow();
        question.setText(questionDetails.getText());
        question.setOptions(questionDetails.getOptions());
        question.setAnswer(questionDetails.getAnswer());
        return questionRepository.save(question);
    }

    public void deleteQuestion(Long id) {
        // Delete from join table first
        jdbcTemplate.update("DELETE FROM quiz_questions WHERE question_id = ?", id);

        // Then delete the question
        questionRepository.deleteById(id);
    }

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }
}
