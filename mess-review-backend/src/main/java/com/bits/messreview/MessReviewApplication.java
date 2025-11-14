package com.bits.messreview;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class MessReviewApplication {

    public static void main(String[] args) {
        SpringApplication.run(MessReviewApplication.class, args);
    }
}
