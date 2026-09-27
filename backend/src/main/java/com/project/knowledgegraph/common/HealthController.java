package com.project.knowledgegraph.common;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.data.neo4j.core.Neo4jClient;
import java.util.Map;
import java.util.HashMap;

@RestController
public class HealthController {
    @Autowired private JdbcTemplate jdbcTemplate;
    @Autowired private Neo4jClient neo4jClient;

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            status.put("postgresql", "UP");
        } catch (Exception e) {
            status.put("postgresql", "DOWN");
        }
        
        try {
            neo4jClient.query("RETURN 1").fetch().one();
            status.put("neo4j", "UP");
        } catch (Exception e) {
            status.put("neo4j", "DOWN");
        }
        return status;
    }
}
