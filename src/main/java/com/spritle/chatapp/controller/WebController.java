package com.spritle.chatapp.controller;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.spritle.chatapp.domain.pojos.SessionData;
import  com.spritle.chatapp.security.CustomUserDetails;;

@Controller
public class WebController {

	@RequestMapping(value = { "/", "home" })
	public String home() {
		return "redirect:/welcome";
	}

	@RequestMapping(value = "/admin")
	public String admin() {
		return "admin";
	}

	@RequestMapping(value = { "/login" })
	public String login() {
		return "redirect:index.html";
	}

	@RequestMapping(value = { "/test" })
	public String test() {
		return "redirect:/Welcome";
	}

	@RequestMapping(value = "/403")
	public String Error403() {
		return "403";
	}
	

	@Transactional(rollbackFor = Exception.class)
	public SessionData getSessionData() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return ((CustomUserDetails) auth.getPrincipal()).getSession();
	}
}
