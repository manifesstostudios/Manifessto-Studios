package com.manifessto.backend.controller;

import com.manifessto.backend.entity.AboutStat;
import com.manifessto.backend.service.AboutStatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/about-stats")
public class AboutStatController {

    private final AboutStatService aboutStatService;

    public AboutStatController(
            AboutStatService aboutStatService
    ) {
        this.aboutStatService = aboutStatService;
    }

    // =========================
    // GET ALL STATS
    // =========================

    @GetMapping
    public ResponseEntity<List<AboutStat>> getAllStats() {

        return ResponseEntity.ok(
                aboutStatService.getAllStats()
        );
    }

    // =========================
    // GET STAT BY ID
    // =========================

    @GetMapping("/{id}")
    public ResponseEntity<AboutStat> getStatById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                aboutStatService.getStatById(id)
        );
    }

    // =========================
    // GET STAT BY KEY
    // =========================

    @GetMapping("/key/{statKey}")
    public ResponseEntity<AboutStat> getStatByKey(
            @PathVariable String statKey
    ) {

        return ResponseEntity.ok(
                aboutStatService.getStatByKey(statKey)
        );
    }

    // =========================
    // ADD STAT
    // =========================

    @PostMapping
    public ResponseEntity<AboutStat> addStat(
            @RequestBody AboutStat stat
    ) {

        return ResponseEntity.ok(
                aboutStatService.addStat(stat)
        );
    }

    // =========================
    // UPDATE STAT
    // =========================

    @PutMapping("/{id}")
    public ResponseEntity<AboutStat> updateStat(
            @PathVariable Long id,
            @RequestBody AboutStat stat
    ) {

        return ResponseEntity.ok(
                aboutStatService.updateStat(
                        id,
                        stat
                )
        );
    }

    // =========================
    // DELETE STAT
    // =========================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStat(
            @PathVariable Long id
    ) {

        aboutStatService.deleteStat(id);

        return ResponseEntity.noContent().build();
    }
}