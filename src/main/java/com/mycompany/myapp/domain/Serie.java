package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Serie.
 */
@Entity
@Table(name = "serie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Serie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "price_in_euro")
    private Float priceInEuro;

    @Column(name = "date_time_add")
    private Instant dateTimeAdd;

    @OneToMany(mappedBy = "serie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "episodes", "serie" }, allowSetters = true)
    private Set<Season> seasons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Serie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Serie name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getPriceInEuro() {
        return this.priceInEuro;
    }

    public Serie priceInEuro(Float priceInEuro) {
        this.setPriceInEuro(priceInEuro);
        return this;
    }

    public void setPriceInEuro(Float priceInEuro) {
        this.priceInEuro = priceInEuro;
    }

    public Instant getDateTimeAdd() {
        return this.dateTimeAdd;
    }

    public Serie dateTimeAdd(Instant dateTimeAdd) {
        this.setDateTimeAdd(dateTimeAdd);
        return this;
    }

    public void setDateTimeAdd(Instant dateTimeAdd) {
        this.dateTimeAdd = dateTimeAdd;
    }

    public Set<Season> getSeasons() {
        return this.seasons;
    }

    public void setSeasons(Set<Season> seasons) {
        if (this.seasons != null) {
            this.seasons.forEach(i -> i.setSerie(null));
        }
        if (seasons != null) {
            seasons.forEach(i -> i.setSerie(this));
        }
        this.seasons = seasons;
    }

    public Serie seasons(Set<Season> seasons) {
        this.setSeasons(seasons);
        return this;
    }

    public Serie addSeason(Season season) {
        this.seasons.add(season);
        season.setSerie(this);
        return this;
    }

    public Serie removeSeason(Season season) {
        this.seasons.remove(season);
        season.setSerie(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Serie)) {
            return false;
        }
        return id != null && id.equals(((Serie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Serie{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", priceInEuro=" + getPriceInEuro() +
            ", dateTimeAdd='" + getDateTimeAdd() + "'" +
            "}";
    }
}
