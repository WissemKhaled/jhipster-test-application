package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Season.
 */
@Entity
@Table(name = "season")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Season implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "season")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "season" }, allowSetters = true)
    private Set<Serie> series = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "seasons" }, allowSetters = true)
    private Episode episode;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Season id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Season name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Serie> getSeries() {
        return this.series;
    }

    public void setSeries(Set<Serie> series) {
        if (this.series != null) {
            this.series.forEach(i -> i.setSeason(null));
        }
        if (series != null) {
            series.forEach(i -> i.setSeason(this));
        }
        this.series = series;
    }

    public Season series(Set<Serie> series) {
        this.setSeries(series);
        return this;
    }

    public Season addSerie(Serie serie) {
        this.series.add(serie);
        serie.setSeason(this);
        return this;
    }

    public Season removeSerie(Serie serie) {
        this.series.remove(serie);
        serie.setSeason(null);
        return this;
    }

    public Episode getEpisode() {
        return this.episode;
    }

    public void setEpisode(Episode episode) {
        this.episode = episode;
    }

    public Season episode(Episode episode) {
        this.setEpisode(episode);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Season)) {
            return false;
        }
        return id != null && id.equals(((Season) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Season{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
