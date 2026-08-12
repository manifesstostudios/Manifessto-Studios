package com.manifessto.backend.service;

import com.manifessto.backend.entity.StudioService;
import com.manifessto.backend.repository.StudioServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudioServiceService {

    private final StudioServiceRepository studioServiceRepository;

    public StudioServiceService(
            StudioServiceRepository studioServiceRepository
    ) {
        this.studioServiceRepository =
                studioServiceRepository;
    }

    // =========================
    // GET ALL SERVICES
    // =========================

    public List<StudioService> getAllServices() {

        return studioServiceRepository
                .findAllByOrderByDisplayOrderAsc();
    }

    // =========================
    // GET SERVICE BY ID
    // =========================

    public StudioService getServiceById(Long id) {

        return studioServiceRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Service not found with id: " + id
                        )
                );
    }

    // =========================
    // ADD SERVICE
    // =========================

    public StudioService addService(
            StudioService service
    ) {

        return studioServiceRepository.save(
                service
        );
    }

    // =========================
    // UPDATE SERVICE
    // =========================

    public StudioService updateService(
            Long id,
            StudioService updatedService
    ) {

        StudioService existingService =
                getServiceById(id);

        existingService.setIcon(
                updatedService.getIcon()
        );

        existingService.setTitle(
                updatedService.getTitle()
        );

        existingService.setShortTitle(
                updatedService.getShortTitle()
        );

        existingService.setDescription(
                updatedService.getDescription()
        );

        existingService.setImageUrl(
                updatedService.getImageUrl()
        );

        existingService.setDisplayOrder(
                updatedService.getDisplayOrder()
        );

        return studioServiceRepository.save(
                existingService
        );
    }

    // =========================
    // DELETE SERVICE
    // =========================

    @Transactional
    public void deleteService(Long id) {

        StudioService existingService =
                getServiceById(id);

        studioServiceRepository.delete(
                existingService
        );
    }
}