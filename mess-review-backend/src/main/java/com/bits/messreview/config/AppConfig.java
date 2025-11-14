package com.bits.messreview.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "app.admin")
@Data
public class AppConfig {
    private List<String> emails = new ArrayList<>();
}
