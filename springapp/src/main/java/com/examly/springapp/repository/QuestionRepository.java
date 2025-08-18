//package com.examly.springapp.repository;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import com.examly.springapp.model.Question;
//
//public interface QuestionRepository extends JpaRepository<Question,Long>{
//
//}
package com.examly.springapp.repository;

import com.examly.springapp.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {}
