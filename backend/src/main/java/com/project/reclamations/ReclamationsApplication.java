package com.project.reclamations;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ReclamationsApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReclamationsApplication.class, args);
    }

    /**
     * Configure OpenAPI/Swagger documentation
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Système de Gestion des Réclamations API")
                        .description("REST API for Customer Complaint Management System")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Support")
                                .email("support@reclamations.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html")));
    }
}
