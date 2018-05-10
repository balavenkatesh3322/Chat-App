package com.spritle.chatapp.configuration;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
public class RestAuthenticationFailureHandler1 extends SimpleUrlAuthenticationFailureHandler {

	@Override
	public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException exception) throws IOException, ServletException {
		response.setContentType("application/json;charset=UTF-8");
		System.out.println(request.getAttribute("username") + "ASDDDDDDDDDD");
		Exception error = (Exception) request.getSession().getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
		System.out.println(error.toString());
		response.setStatus(HttpServletResponse.SC_NOT_FOUND);
		response.setHeader("message", "error MEssage");

	}
}