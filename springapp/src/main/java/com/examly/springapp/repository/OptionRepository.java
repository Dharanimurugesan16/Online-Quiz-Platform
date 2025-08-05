package com.examly.springapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.examly.springapp.model.Option;

public interface OptionRepository extends JpaRepository<Option,Long> {
    
}
