package com.manifessto.backend.service;

import com.manifessto.backend.entity.ServiceItem;
import com.manifessto.backend.entity.StudioService;
import com.manifessto.backend.repository.ServiceItemRepository;
import com.manifessto.backend.repository.StudioServiceRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ServiceItemService {

    private final ServiceItemRepository serviceItemRepository;

    private final StudioServiceRepository studioServiceRepository;


    public ServiceItemService(
            ServiceItemRepository serviceItemRepository,
            StudioServiceRepository studioServiceRepository
    ) {
        this.serviceItemRepository =
                serviceItemRepository;

        this.studioServiceRepository =
                studioServiceRepository;
    }


    // =====================================================
    // GET ITEMS BY SERVICE
    // =====================================================

    public List<ServiceItem> getItemsByService(
            Long serviceId
    ) {

        if (!studioServiceRepository.existsById(
                serviceId
        )) {

            throw new RuntimeException(
                    "Service not found with id: "
                            + serviceId
            );
        }

        return serviceItemRepository
                .findAllByServiceIdOrderByDisplayOrderAsc(
                        serviceId
                );
    }


    // =====================================================
    // GET ITEM BY ID
    // =====================================================

    public ServiceItem getItemById(
            Long id
    ) {

        return serviceItemRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Service item not found with id: "
                                        + id
                        )
                );
    }


    // =====================================================
    // ADD ITEM
    // =====================================================

    @Transactional
    public ServiceItem addItem(
            Long serviceId,
            ServiceItem item
    ) {

        StudioService service =
                studioServiceRepository
                        .findById(serviceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service not found with id: "
                                                + serviceId
                                )
                        );

        // Service is decided by URL serviceId.
        // Frontend cannot control the relationship.
        item.setService(service);

        return serviceItemRepository.save(item);
    }


    // =====================================================
    // UPDATE ITEM
    // =====================================================

    @Transactional
    public ServiceItem updateItem(
            Long id,
            ServiceItem updatedItem
    ) {

        ServiceItem existingItem =
                getItemById(id);

        existingItem.setItemName(
                updatedItem.getItemName()
        );

        existingItem.setImageUrl(
                updatedItem.getImageUrl()
        );

        existingItem.setDisplayOrder(
                updatedItem.getDisplayOrder()
        );

        return serviceItemRepository.save(
                existingItem
        );
    }


    // =====================================================
    // DELETE ITEM
    // =====================================================

    @Transactional
    public void deleteItem(
            Long id
    ) {

        ServiceItem existingItem =
                getItemById(id);

        serviceItemRepository.delete(
                existingItem
        );
    }
}