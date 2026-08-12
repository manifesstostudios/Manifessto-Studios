package com.manifessto.backend.service;

import com.manifessto.backend.entity.AboutStat;
import com.manifessto.backend.repository.AboutStatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AboutStatService {

    private final AboutStatRepository aboutStatRepository;

    public AboutStatService(
            AboutStatRepository aboutStatRepository
    ) {
        this.aboutStatRepository = aboutStatRepository;
    }

    // =========================
    // GET ALL STATS
    // =========================

    public List<AboutStat> getAllStats() {

        return aboutStatRepository
                .findAllByOrderByDisplayOrderAsc();
    }

    // =========================
    // GET STAT BY ID
    // =========================

    public AboutStat getStatById(Long id) {

        return aboutStatRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "About stat not found with id: " + id
                        )
                );
    }

    // =========================
    // GET STAT BY KEY
    // =========================

    public AboutStat getStatByKey(String statKey) {

        return aboutStatRepository
                .findByStatKey(statKey)
                .orElseThrow(() ->
                        new RuntimeException(
                                "About stat not found with key: "
                                        + statKey
                        )
                );
    }

    // =========================
    // ADD STAT
    // =========================

    public AboutStat addStat(AboutStat stat) {

        return aboutStatRepository.save(stat);
    }

    // =========================
    // UPDATE STAT
    // =========================

    public AboutStat updateStat(
            Long id,
            AboutStat updatedStat
    ) {

        AboutStat existingStat =
                getStatById(id);

        existingStat.setStatKey(
                updatedStat.getStatKey()
        );

        existingStat.setValue(
                updatedStat.getValue()
        );

        existingStat.setSuffix(
                updatedStat.getSuffix()
        );

        existingStat.setLabel(
                updatedStat.getLabel()
        );

        existingStat.setDisplayOrder(
                updatedStat.getDisplayOrder()
        );

        return aboutStatRepository.save(
                existingStat
        );
    }

    // =========================
    // DELETE STAT
    // =========================

    public void deleteStat(Long id) {

        AboutStat existingStat =
                getStatById(id);

        aboutStatRepository.delete(
                existingStat
        );
    }
}