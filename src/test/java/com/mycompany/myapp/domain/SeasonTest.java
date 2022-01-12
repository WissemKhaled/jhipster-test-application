package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SeasonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Season.class);
        Season season1 = new Season();
        season1.setId(1L);
        Season season2 = new Season();
        season2.setId(season1.getId());
        assertThat(season1).isEqualTo(season2);
        season2.setId(2L);
        assertThat(season1).isNotEqualTo(season2);
        season1.setId(null);
        assertThat(season1).isNotEqualTo(season2);
    }
}
