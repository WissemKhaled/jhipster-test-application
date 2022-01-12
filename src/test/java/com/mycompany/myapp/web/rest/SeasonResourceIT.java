package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Season;
import com.mycompany.myapp.repository.SeasonRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link SeasonResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SeasonResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/seasons";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SeasonRepository seasonRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSeasonMockMvc;

    private Season season;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Season createEntity(EntityManager em) {
        Season season = new Season().name(DEFAULT_NAME);
        return season;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Season createUpdatedEntity(EntityManager em) {
        Season season = new Season().name(UPDATED_NAME);
        return season;
    }

    @BeforeEach
    public void initTest() {
        season = createEntity(em);
    }

    @Test
    @Transactional
    void createSeason() throws Exception {
        int databaseSizeBeforeCreate = seasonRepository.findAll().size();
        // Create the Season
        restSeasonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(season)))
            .andExpect(status().isCreated());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeCreate + 1);
        Season testSeason = seasonList.get(seasonList.size() - 1);
        assertThat(testSeason.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createSeasonWithExistingId() throws Exception {
        // Create the Season with an existing ID
        season.setId(1L);

        int databaseSizeBeforeCreate = seasonRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSeasonMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(season)))
            .andExpect(status().isBadRequest());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSeasons() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        // Get all the seasonList
        restSeasonMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(season.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getSeason() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        // Get the season
        restSeasonMockMvc
            .perform(get(ENTITY_API_URL_ID, season.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(season.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingSeason() throws Exception {
        // Get the season
        restSeasonMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewSeason() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();

        // Update the season
        Season updatedSeason = seasonRepository.findById(season.getId()).get();
        // Disconnect from session so that the updates on updatedSeason are not directly saved in db
        em.detach(updatedSeason);
        updatedSeason.name(UPDATED_NAME);

        restSeasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSeason.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSeason))
            )
            .andExpect(status().isOk());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
        Season testSeason = seasonList.get(seasonList.size() - 1);
        assertThat(testSeason.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, season.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(season))
            )
            .andExpect(status().isBadRequest());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(season))
            )
            .andExpect(status().isBadRequest());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(season)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSeasonWithPatch() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();

        // Update the season using partial update
        Season partialUpdatedSeason = new Season();
        partialUpdatedSeason.setId(season.getId());

        restSeasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeason.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeason))
            )
            .andExpect(status().isOk());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
        Season testSeason = seasonList.get(seasonList.size() - 1);
        assertThat(testSeason.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateSeasonWithPatch() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();

        // Update the season using partial update
        Season partialUpdatedSeason = new Season();
        partialUpdatedSeason.setId(season.getId());

        partialUpdatedSeason.name(UPDATED_NAME);

        restSeasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSeason.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSeason))
            )
            .andExpect(status().isOk());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
        Season testSeason = seasonList.get(seasonList.size() - 1);
        assertThat(testSeason.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, season.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(season))
            )
            .andExpect(status().isBadRequest());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(season))
            )
            .andExpect(status().isBadRequest());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSeason() throws Exception {
        int databaseSizeBeforeUpdate = seasonRepository.findAll().size();
        season.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSeasonMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(season)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Season in the database
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSeason() throws Exception {
        // Initialize the database
        seasonRepository.saveAndFlush(season);

        int databaseSizeBeforeDelete = seasonRepository.findAll().size();

        // Delete the season
        restSeasonMockMvc
            .perform(delete(ENTITY_API_URL_ID, season.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Season> seasonList = seasonRepository.findAll();
        assertThat(seasonList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
