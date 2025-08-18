//package com.examly.springapp.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import com.examly.springapp.model.Quiz;
//
//@Repository
//public interface QuizRepository extends JpaRepository<Quiz, Long>{
//
//}
package com.examly.springapp.repository;

import com.examly.springapp.model.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {}
