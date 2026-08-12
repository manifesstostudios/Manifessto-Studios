package com.manifessto.backend.repository;

import com.manifessto.backend.entity.TrustedBrand;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrustedBrandRepository
        extends JpaRepository<TrustedBrand, Long> {

    List<TrustedBrand>
    findByActiveTrueOrderByDisplayOrderAsc();

    List<TrustedBrand>
    findAllByOrderByDisplayOrderAsc();
}