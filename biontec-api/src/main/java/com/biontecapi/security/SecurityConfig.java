package com.biontecapi.security;

import static org.springframework.http.HttpMethod.*;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
/* import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer; */

import com.biontecapi.config.PasswordEnconderConfig;
import com.biontecapi.fiter.CustomAuthenticationFilter;
import com.biontecapi.fiter.CustomAuthorizationFilter;

import lombok.RequiredArgsConstructor;


@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsService userDetailsService;
    private final PasswordEnconderConfig passwordEnconderConfig;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEnconderConfig.PasswordEnconderConfig());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
        customAuthenticationFilter.setFilterProcessesUrl("/api/login/");
        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers(POST, "/api/pagamentos/efi/webhook").permitAll() //PARA LIBERAR O WEBHOOK
                .antMatchers(GET, "/api/user/token-refresh/**", "/api/produtos/**", "/api/paises/**","/api/nfe/**").permitAll()
                .antMatchers(POST, "/api/login/**", "/api/user/save-user","/api/nfe/**").permitAll()
                .antMatchers(POST, "/api/user/save-role", "/api/user/role-addtouser").hasAnyAuthority("ROLE_ADMIN")
                .anyRequest().authenticated().and()
                .addFilter(customAuthenticationFilter).cors();
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }

     /*   @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
        customAuthenticationFilter.setFilterProcessesUrl("/api/login/");

        http.csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
                .authorizeRequests()
                .antMatchers(GET, "/api/user/token-refresh/**", "/api/produtos/**", "/api/paises/**","/api/nfe/**").permitAll()
                .antMatchers(POST, "/api/login/**", "/api/user/save-user","/api/nfe/**").permitAll()
                // ADICIONE ESTA LINHA se quiser permitir salvar itens sem validar token (para teste)
                // Caso contrário, certifique-se que o Angular Interceptor está enviando o Bearer Token
                .antMatchers(POST, "/api/itensDaVenda/salvar").authenticated()
                .antMatchers(POST, "/api/user/save-role", "/api/user/role-addtouser").hasAnyAuthority("ROLE_ADMIN")
                .anyRequest().authenticated().and()
                .addFilter(customAuthenticationFilter).cors();
        http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
    }
*/

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);
        config.setAllowedOrigins(Arrays.asList("http://localhost:4200"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }




}
