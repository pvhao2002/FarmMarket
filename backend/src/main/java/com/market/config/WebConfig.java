package com.market.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class WebConfig implements WebMvcConfigurer {
    private final LogInterceptor apiResponseInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(apiResponseInterceptor)
                .addPathPatterns("/farm-market-api/**")
                .excludePathPatterns("/farm-market-api/auth/login", "/farm-market-api/auth/register"); // Exclude auth endpoints from some processing
    }
}
