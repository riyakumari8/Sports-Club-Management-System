package com.clubsphere;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ClubSphereApplication — The main entry point for the Spring Boot application.
 *
 * When you run this class, it starts the embedded Tomcat web server on port 8080
 * and loads all the Spring beans (services, controllers, repositories) automatically.
 *
 * @SpringBootApplication is a shortcut that enables:
 *   - @Configuration: marks this as a configuration source
 *   - @EnableAutoConfiguration: Spring auto-configures beans based on classpath
 *   - @ComponentScan: scans all sub-packages for Spring components
 */
@SpringBootApplication
public class ClubSphereApplication {

    /**
     * main() — Java program entry point.
     * Starts the entire Spring Boot application.
     *
     * @param args command-line arguments (not used normally)
     */
    public static void main(String[] args) {
        SpringApplication.run(ClubSphereApplication.class, args);
    }
}
