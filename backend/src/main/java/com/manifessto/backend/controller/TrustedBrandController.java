package com.manifessto.backend.controller;

import com.manifessto.backend.entity.TrustedBrand;
import com.manifessto.backend.service.TrustedBrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trusted-by")
public class TrustedBrandController {

    private final TrustedBrandService trustedBrandService;

    public TrustedBrandController(
            TrustedBrandService trustedBrandService
    ) {
        this.trustedBrandService =
                trustedBrandService;
    }


    // =====================================================
    // GET ALL BRANDS
    // ADMIN PANEL
    // =====================================================

    @GetMapping
    public ResponseEntity<List<TrustedBrand>> getAllBrands() {

        return ResponseEntity.ok(
                trustedBrandService.getAllBrands()
        );
    }


    // =====================================================
    // GET ACTIVE BRANDS
    // PUBLIC WEBSITE
    // =====================================================

    @GetMapping("/active")
    public ResponseEntity<List<TrustedBrand>> getActiveBrands() {

        return ResponseEntity.ok(
                trustedBrandService.getActiveBrands()
        );
    }


    // =====================================================
    // ADD BRAND
    // =====================================================

    @PostMapping
    public ResponseEntity<TrustedBrand> addBrand(
            @RequestBody TrustedBrand trustedBrand
    ) {

        return ResponseEntity.ok(
                trustedBrandService.addBrand(
                        trustedBrand
                )
        );
    }


    // =====================================================
    // GET BRAND BY ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<TrustedBrand> getBrandById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                trustedBrandService.getBrandById(
                        id
                )
        );
    }


    // =====================================================
    // UPDATE BRAND
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<TrustedBrand> updateBrand(
            @PathVariable Long id,
            @RequestBody TrustedBrand trustedBrand
    ) {

        return ResponseEntity.ok(
                trustedBrandService.updateBrand(
                        id,
                        trustedBrand
                )
        );
    }


    // =====================================================
    // DELETE BRAND
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBrand(
            @PathVariable Long id
    ) {

        trustedBrandService.deleteBrand(id);

        return ResponseEntity.noContent().build();
    }
}