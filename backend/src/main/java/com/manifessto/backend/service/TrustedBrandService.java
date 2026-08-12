package com.manifessto.backend.service;

import com.manifessto.backend.entity.TrustedBrand;
import com.manifessto.backend.repository.TrustedBrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TrustedBrandService {

    private final TrustedBrandRepository trustedBrandRepository;

    public TrustedBrandService(
            TrustedBrandRepository trustedBrandRepository
    ) {
        this.trustedBrandRepository =
                trustedBrandRepository;
    }


    // =====================================================
    // GET ALL BRANDS
    // ADMIN
    // =====================================================

    public List<TrustedBrand> getAllBrands() {

        return trustedBrandRepository
                .findAllByOrderByDisplayOrderAsc();
    }


    // =====================================================
    // GET ACTIVE BRANDS
    // PUBLIC WEBSITE
    // =====================================================

    public List<TrustedBrand> getActiveBrands() {

        return trustedBrandRepository
                .findByActiveTrueOrderByDisplayOrderAsc();
    }


    // =====================================================
    // GET BRAND BY ID
    // =====================================================

    public TrustedBrand getBrandById(Long id) {

        return trustedBrandRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Trusted brand not found with id: "
                                        + id
                        )
                );
    }


    // =====================================================
    // ADD BRAND
    // =====================================================

    @Transactional
    public TrustedBrand addBrand(
            TrustedBrand trustedBrand
    ) {

        return trustedBrandRepository.save(
                trustedBrand
        );
    }


    // =====================================================
    // UPDATE BRAND
    // =====================================================

    @Transactional
    public TrustedBrand updateBrand(
            Long id,
            TrustedBrand updatedBrand
    ) {

        TrustedBrand existingBrand =
                getBrandById(id);

        existingBrand.setName(
                updatedBrand.getName()
        );

        existingBrand.setDisplayOrder(
                updatedBrand.getDisplayOrder()
        );

        existingBrand.setActive(
                updatedBrand.getActive()
        );

        return trustedBrandRepository.save(
                existingBrand
        );
    }


    // =====================================================
    // DELETE BRAND
    // =====================================================

    @Transactional
    public void deleteBrand(Long id) {

        TrustedBrand existingBrand =
                getBrandById(id);

        trustedBrandRepository.delete(
                existingBrand
        );
    }
}