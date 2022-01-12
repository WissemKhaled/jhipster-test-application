package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Season;
import com.mycompany.myapp.repository.SeasonRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Season}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SeasonResource {

    private final Logger log = LoggerFactory.getLogger(SeasonResource.class);

    private static final String ENTITY_NAME = "season";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SeasonRepository seasonRepository;

    public SeasonResource(SeasonRepository seasonRepository) {
        this.seasonRepository = seasonRepository;
    }

    /**
     * {@code POST  /seasons} : Create a new season.
     *
     * @param season the season to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new season, or with status {@code 400 (Bad Request)} if the season has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/seasons")
    public ResponseEntity<Season> createSeason(@RequestBody Season season) throws URISyntaxException {
        log.debug("REST request to save Season : {}", season);
        if (season.getId() != null) {
            throw new BadRequestAlertException("A new season cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Season result = seasonRepository.save(season);
        return ResponseEntity
            .created(new URI("/api/seasons/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /seasons/:id} : Updates an existing season.
     *
     * @param id the id of the season to save.
     * @param season the season to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated season,
     * or with status {@code 400 (Bad Request)} if the season is not valid,
     * or with status {@code 500 (Internal Server Error)} if the season couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/seasons/{id}")
    public ResponseEntity<Season> updateSeason(@PathVariable(value = "id", required = false) final Long id, @RequestBody Season season)
        throws URISyntaxException {
        log.debug("REST request to update Season : {}, {}", id, season);
        if (season.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, season.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seasonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Season result = seasonRepository.save(season);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, season.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /seasons/:id} : Partial updates given fields of an existing season, field will ignore if it is null
     *
     * @param id the id of the season to save.
     * @param season the season to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated season,
     * or with status {@code 400 (Bad Request)} if the season is not valid,
     * or with status {@code 404 (Not Found)} if the season is not found,
     * or with status {@code 500 (Internal Server Error)} if the season couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/seasons/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Season> partialUpdateSeason(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Season season
    ) throws URISyntaxException {
        log.debug("REST request to partial update Season partially : {}, {}", id, season);
        if (season.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, season.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!seasonRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Season> result = seasonRepository
            .findById(season.getId())
            .map(existingSeason -> {
                if (season.getName() != null) {
                    existingSeason.setName(season.getName());
                }

                return existingSeason;
            })
            .map(seasonRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, season.getId().toString())
        );
    }

    /**
     * {@code GET  /seasons} : get all the seasons.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of seasons in body.
     */
    @GetMapping("/seasons")
    public List<Season> getAllSeasons() {
        log.debug("REST request to get all Seasons");
        return seasonRepository.findAll();
    }

    /**
     * {@code GET  /seasons/:id} : get the "id" season.
     *
     * @param id the id of the season to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the season, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/seasons/{id}")
    public ResponseEntity<Season> getSeason(@PathVariable Long id) {
        log.debug("REST request to get Season : {}", id);
        Optional<Season> season = seasonRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(season);
    }

    /**
     * {@code DELETE  /seasons/:id} : delete the "id" season.
     *
     * @param id the id of the season to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/seasons/{id}")
    public ResponseEntity<Void> deleteSeason(@PathVariable Long id) {
        log.debug("REST request to delete Season : {}", id);
        seasonRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
