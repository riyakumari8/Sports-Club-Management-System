package com.clubsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ClubSphereApplication {

    public static void main(String[] args) {
        SpringApplication.run(ClubSphereApplication.class, args);
        System.out.println("=================================================");
        System.out.println("  ClubSphere Backend API Started Successfully!   ");
        System.out.println("  Swagger UI: http://localhost:8080/swagger-ui.html");
        System.out.println("=================================================");
    }
}
