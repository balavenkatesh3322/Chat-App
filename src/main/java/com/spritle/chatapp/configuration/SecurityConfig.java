package com.spritle.chatapp.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.spritle.chatapp.security.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@ComponentScan(basePackageClasses = CustomUserDetailsService.class)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService userDetailsService;

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests().antMatchers("/resources/**").permitAll().anyRequest().permitAll()
				.antMatchers("/welcome").permitAll().antMatchers("/admin").hasRole("ADMIN").anyRequest().authenticated()
				.and().formLogin().failureHandler(new RestAuthenticationFailureHandler1()).loginPage("/login")
				.usernameParameter("username").passwordParameter("password").permitAll().and().logout()
				.deleteCookies("JSESSIONID").permitAll().and().exceptionHandling().accessDeniedPage("/403").and().csrf()
				.disable();
	}

	@Override
	public void configure(WebSecurity web) {
		// allow css
		web.ignoring().antMatchers("/css/**", "/js/**", "/particlejs/**", "/fonts/**", "/images/**", "/img/**",
				"/index_files/**", "/index.html","/signup-userdetails/","/check-userduplicate/","/validate-user-reset-code/**");
	}

	@Autowired
	public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(passwordencoder());
	}

	@Bean(name = "passwordEncoder")
	public PasswordEncoder passwordencoder() {
		return new CustomPasswordEncoder();
	}

	public static UserDetails getCurrentLoggedInUserDetails() {
		SecurityContext securityContext = SecurityContextHolder.getContext();
		Authentication authentication = securityContext.getAuthentication();
		if (authentication != null) {
			Object principal = authentication.getPrincipal();
			return principal instanceof UserDetails ? (UserDetails) principal : null;
		}
		return null;
	}

}
