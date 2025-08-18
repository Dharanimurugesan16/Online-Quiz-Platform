//
//package com.examly.springapp.model;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import jakarta.persistence.*;
//import jakarta.validation.constraints.NotBlank;
//import lombok.*;
//import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
//import java.util.ArrayList;
//
//
//@Entity
//@NoArgsConstructor
//@AllArgsConstructor
//@Getter
//@Setter
//@Builder
//@Table(name="quiz")
//public class Quiz {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name="quiz_id")
//    private long id;
//
//    @Column(name="title")
//    @NotBlank
//    private String title;
//
//    @Column(name="description")
//    private String description;
//
//    @Column(name="time_limit")
//    private int timeLimit;
//
//    @Column(name="created_at")
//    private LocalDateTime createdAt;
//
//    @Column(name="updated_at")
//    private LocalDateTime updatedAt;
//
//    @ManyToMany
//    @JoinTable(
//            name = "quiz_questions",
//            joinColumns = @JoinColumn(name = "quiz_id"),
//            inverseJoinColumns = @JoinColumn(name = "question_id")
//    )
//    private List<Question> questions;
////    @ManyToMany(mappedBy = "assignedQuizzes")
////    @JsonIgnoreProperties("assignedQuizzes")
////    private List<User> users = new ArrayList<>();
//
//
//}
package com.examly.springapp.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private long id;

    @Column(name = "title")
    @NotBlank
    private String title;

    @Column(name = "description")
    private String description;

    @Column(name = "time_limit")
    private int timeLimit;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "quiz_questions",
            joinColumns = @JoinColumn(name = "quiz_id"),
            inverseJoinColumns = @JoinColumn(name = "question_id")
    )
    private List<Question> questions = new ArrayList<>();

    @ManyToMany(mappedBy = "assignedQuizzes")
    @JsonIgnoreProperties("assignedQuizzes")
    @Builder.Default
    private List<User> users = new ArrayList<>();
}
