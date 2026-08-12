package com.manifessto.backend.controller;

import com.manifessto.backend.entity.ServiceItem;
import com.manifessto.backend.service.ServiceItemService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class ServiceItemController {

    private final ServiceItemService serviceItemService;


    public ServiceItemController(
            ServiceItemService serviceItemService
    ) {
        this.serviceItemService =
                serviceItemService;
    }


    // =====================================================
    // GET ITEMS BY SERVICE
    // =====================================================

    @GetMapping(
            "/services/{serviceId}/items"
    )
    public ResponseEntity<List<ServiceItem>>
    getItemsByService(
            @PathVariable Long serviceId
    ) {

        return ResponseEntity.ok(
                serviceItemService
                        .getItemsByService(
                                serviceId
                        )
        );
    }


    // =====================================================
    // ADD ITEM
    // =====================================================

    @PostMapping(
            "/services/{serviceId}/items"
    )
    public ResponseEntity<ServiceItem>
    addItem(
            @PathVariable Long serviceId,
            @RequestBody ServiceItem item
    ) {

        return ResponseEntity.ok(
                serviceItemService.addItem(
                        serviceId,
                        item
                )
        );
    }


    // =====================================================
    // GET ITEM BY ID
    // =====================================================

    @GetMapping(
            "/service-items/{id}"
    )
    public ResponseEntity<ServiceItem>
    getItemById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                serviceItemService
                        .getItemById(id)
        );
    }


    // =====================================================
    // UPDATE ITEM
    // =====================================================

    @PutMapping(
            "/service-items/{id}"
    )
    public ResponseEntity<ServiceItem>
    updateItem(
            @PathVariable Long id,
            @RequestBody ServiceItem item
    ) {

        return ResponseEntity.ok(
                serviceItemService.updateItem(
                        id,
                        item
                )
        );
    }


    // =====================================================
    // DELETE ITEM
    // =====================================================

    @DeleteMapping(
            "/service-items/{id}"
    )
    public ResponseEntity<Void>
    deleteItem(
            @PathVariable Long id
    ) {

        serviceItemService.deleteItem(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}