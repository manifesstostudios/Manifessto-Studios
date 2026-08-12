package com.manifessto.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "service_items")
public class ServiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "service_id",
            nullable = false
    )
    @JsonIgnore
    private StudioService service;

    @Column(
            name = "item_name",
            nullable = false
    )
    private String itemName;

    @Column(
            name = "image_url",
            length = 1000
    )
    private String imageUrl;

    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public ServiceItem() {
    }


    public ServiceItem(
            StudioService service,
            String itemName,
            String imageUrl,
            Integer displayOrder
    ) {
        this.service = service;
        this.itemName = itemName;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }


    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }


    public StudioService getService() {
        return service;
    }

    public void setService(
            StudioService service
    ) {
        this.service = service;
    }


    public String getItemName() {
        return itemName;
    }

    public void setItemName(
            String itemName
    ) {
        this.itemName = itemName;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(
            String imageUrl
    ) {
        this.imageUrl = imageUrl;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(
            Integer displayOrder
    ) {
        this.displayOrder = displayOrder;
    }
}