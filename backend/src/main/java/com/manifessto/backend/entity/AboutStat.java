package com.manifessto.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "about_stats")
public class AboutStat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stat_key", nullable = false, unique = true)
    private String statKey;

    @Column(nullable = false)
    private Integer value;

    @Column(nullable = false)
    private String suffix;

    @Column(nullable = false)
    private String label;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    public AboutStat() {
    }

    public AboutStat(
            String statKey,
            Integer value,
            String suffix,
            String label,
            Integer displayOrder
    ) {
        this.statKey = statKey;
        this.value = value;
        this.suffix = suffix;
        this.label = label;
        this.displayOrder = displayOrder;
    }

    public Long getId() {
        return id;
    }

    public String getStatKey() {
        return statKey;
    }

    public void setStatKey(String statKey) {
        this.statKey = statKey;
    }

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public String getSuffix() {
        return suffix;
    }

    public void setSuffix(String suffix) {
        this.suffix = suffix;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Integer getDisplayOrder() {
        return displayOrder;
    }

    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
}