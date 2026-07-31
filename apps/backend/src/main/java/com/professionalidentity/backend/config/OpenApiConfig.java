package com.professionalidentity.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTHENTICATION_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI professionalIdentityOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Professional Identity Platform API")
                        .version("v1")
                        .description("REST API for managing professional profiles and public portfolios.")
                        .contact(new Contact()
                                .name("Professional Identity Platform Team")
                                .email("support@professionalidentity.local")))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTHENTICATION_SCHEME))
                .components(new Components().addSecuritySchemes(
                        BEARER_AUTHENTICATION_SCHEME,
                        new SecurityScheme()
                                .name(BEARER_AUTHENTICATION_SCHEME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                ));
    }

    @Bean
    public GroupedOpenApi authenticatedApi() {
        return GroupedOpenApi.builder()
                .group("authenticated-api")
                .pathsToMatch("/api/v1/**")
                .pathsToExclude("/api/v1/auth/**", "/api/v1/public/**", "/api/v1/health")
                .build();
    }

    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
                .group("public-api")
                .pathsToMatch("/api/v1/auth/**", "/api/v1/public/**", "/api/v1/health")
                .build();
    }
}
