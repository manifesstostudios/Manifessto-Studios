package com.manifessto.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "services")
public class StudioService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String icon;

    @Column(nullable = false)
    private String title;

    @Column(name = "short_title", nullable = false)
    private String shortTitle;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    /*
     * One Service can have many ServiceItems.
     *
     * When a Service is deleted:
     * 1. Its ServiceItems are deleted
     * 2. Then the Service is deleted
     */
    @OneToMany(
            mappedBy = "service",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<ServiceItem> items = new ArrayList<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public StudioService() {
    }


    public StudioService(
            String icon,
            String title,
            String shortTitle,
            String description,
            String imageUrl,
            Integer displayOrder
    ) {
        this.icon = icon;
        this.title = title;
        this.shortTitle = shortTitle;
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
    }


    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }


    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }


    public String getShortTitle() {
        return shortTitle;
    }

    public void setShortTitle(String shortTitle) {
        this.shortTitle = shortTitle;
    }


    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }


    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }


    public List<ServiceItem> getItems() {
        return items;
    }

    public void setItems(List<ServiceItem> items) {
        this.items = items;
    }


    // =====================================================
    // HELPER METHODS
    // =====================================================

    public void addItem(ServiceItem item) {

        items.add(item);

        item.setService(this);
    }


    public void removeItem(ServiceItem item) {

        items.remove(item);

        item.setService(null);
    }
}