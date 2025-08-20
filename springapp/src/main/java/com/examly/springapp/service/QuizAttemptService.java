package com.examly.springapp.service;

import com.examly.springapp.model.Quiz;
import com.examly.springapp.model.QuizAttempt;
import com.examly.springapp.model.Question;
import com.examly.springapp.repository.QuizAttemptRepository;
import com.examly.springapp.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;

    public QuizAttemptService(QuizAttemptRepository quizAttemptRepository, QuizRepository quizRepository) {
        this.quizAttemptRepository = quizAttemptRepository;
        this.quizRepository = quizRepository;
    }

    public QuizAttempt saveQuizAttempt(QuizAttempt quizAttempt) {
        // Validate quiz exists
        Quiz quiz = quizRepository.findById(quizAttempt.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found with ID: " + quizAttempt.getQuizId()));

        // Validate answers
        for (Question question : quiz.getQuestions()) {
            QuizAttempt.AnswerDetails answerDetails = quizAttempt.getAnswers().get(String.valueOf(question.getId()));
            if (answerDetails == null) {
                throw new RuntimeException("Missing answer for question ID: " + question.getId());
            }
            String selectedAnswer = answerDetails.getSelectedAnswer();
            if (selectedAnswer != null) {
                if (question.getType() == Question.QuestionType.MULTIPLE_CHOICE) {
                    String[] options = question.getOptions().split(",");
                    if (!List.of(options).contains(selectedAnswer)) {
                        throw new RuntimeException("Invalid selected answer for question ID: " + question.getId());
                    }
                } else if (question.getType() == Question.QuestionType.TRUE_FALSE) {
                    if (!selectedAnswer.equals("true") && !selectedAnswer.equals("false")) {
                        throw new RuntimeException("Invalid selected answer for true/false question ID: " + question.getId());
                    }
                }
            }
        }

        // Check if user has previous attempts for this quiz
        List<QuizAttempt> existingAttempts = quizAttemptRepository.findByUserIdAndQuizId(
                quizAttempt.getUserId(), quizAttempt.getQuizId());
        int attemptCount = existingAttempts.size() + 1;

        // Set attempt count and completed date
        quizAttempt.setAttempts(attemptCount);
        quizAttempt.setCompletedDate(LocalDateTime.now());

        return quizAttemptRepository.save(quizAttempt);
    }

    public List<QuizAttempt> getUserQuizAttempts(String userId) {
        return quizAttemptRepository.findByUserId(userId);
    }

    public QuizAttempt getQuizAttemptById(Long attemptId) {
        return quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found with ID: " + attemptId));
    }
}