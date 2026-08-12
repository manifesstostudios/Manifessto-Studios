package com.manifessto.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "team_members")
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String name;


    @Column(nullable = false)
    private String role;


    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String description;


    @Column(
            name = "image_url",
            nullable = false
    )
    private String imageUrl;


    /*
     * OLD COLUMNS
     *
     * Kept so existing Instagram / LinkedIn
     * data is not lost.
     */
    private String instagram;

    private String linkedin;


    /*
     * NEW CUSTOM SOCIAL LINKS
     *
     * Example:
     *
     * [
     *   {
     *     "platform": "instagram",
     *     "url": "https://instagram.com/example"
     *   },
     *   {
     *     "platform": "youtube",
     *     "url": "https://youtube.com/@example"
     *   }
     * ]
     */
    @Column(
            name = "social_links",
            columnDefinition = "TEXT"
    )
    private String socialLinks;


    @Column(
            name = "display_order",
            nullable = false
    )
    private Integer displayOrder;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public TeamMember() {
    }


    // =====================================================
    // OLD CONSTRUCTOR
    // =====================================================

    public TeamMember(
            String name,
            String role,
            String description,
            String imageUrl,
            String instagram,
            String linkedin,
            Integer displayOrder
    ) {

        this.name = name;

        this.role = role;

        this.description = description;

        this.imageUrl = imageUrl;

        this.instagram = instagram;

        this.linkedin = linkedin;

        this.displayOrder = displayOrder;
    }


    // =====================================================
    // NEW CONSTRUCTOR
    // =====================================================

    public TeamMember(
            String name,
            String role,
            String description,
            String imageUrl,
            String instagram,
            String linkedin,
            String socialLinks,
            Integer displayOrder
    ) {

        this.name = name;

        this.role = role;

        this.description = description;

        this.imageUrl = imageUrl;

        this.instagram = instagram;

        this.linkedin = linkedin;

        this.socialLinks = socialLinks;

        this.displayOrder = displayOrder;
    }


    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }


    public String getName() {
        return name;
    }


    public String getRole() {
        return role;
    }


    public String getDescription() {
        return description;
    }


    public String getImageUrl() {
        return imageUrl;
    }


    public String getInstagram() {
        return instagram;
    }


    public String getLinkedin() {
        return linkedin;
    }


    public String getSocialLinks() {
        return socialLinks;
    }


    public Integer getDisplayOrder() {
        return displayOrder;
    }


    // =====================================================
    // SETTERS
    // =====================================================

    public void setName(String name) {
        this.name = name;
    }


    public void setRole(String role) {
        this.role = role;
    }


    public void setDescription(String description) {
        this.description = description;
    }


    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    public void setInstagram(String instagram) {
        this.instagram = instagram;
    }


    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }


    public void setSocialLinks(String socialLinks) {
        this.socialLinks = socialLinks;
    }


    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}