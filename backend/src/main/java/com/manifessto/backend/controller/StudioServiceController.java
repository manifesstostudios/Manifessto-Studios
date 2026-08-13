package com.manifessto.backend.controller;

import com.manifessto.backend.entity.StudioService;
import com.manifessto.backend.service.StudioServiceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class StudioServiceController {

    private final StudioServiceService studioServiceService;

    public StudioServiceController(
            StudioServiceService studioServiceService
    ) {
        this.studioServiceService = studioServiceService;
    }

    // =========================
    // GET ALL SERVICES
    // =========================

    @GetMapping
    public ResponseEntity<List<StudioService>> getAllServices() {

        return ResponseEntity.ok(
                studioServiceService.getAllServices()
        );
    }

    // =========================
    // GET SERVICE BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<StudioService> getServiceById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                studioServiceService.getServiceById(id)
        );
    }

    // =========================
    // ADD SERVICE
    // =========================

    @PostMapping
    public ResponseEntity<StudioService> addService(
            @RequestBody StudioService service
    ) {

        return ResponseEntity.ok(
                studioServiceService.addService(service)
        );
    }

    // =========================
    // UPDATE SERVICE
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<StudioService> updateService(
            @PathVariable Long id,
            @RequestBody StudioService service
    ) {

        return ResponseEntity.ok(
                studioServiceService.updateService(
                        id,
                        service
                )
        );
    }

    // =========================
    // DELETE SERVICE
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(
            @PathVariable Long id
    ) {

        studioServiceService.deleteService(id);

        return ResponseEntity.noContent().build();
    }
}