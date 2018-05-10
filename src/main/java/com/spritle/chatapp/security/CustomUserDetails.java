package com.spritle.chatapp.security;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;

import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.domain.pojos.SessionData;

public class CustomUserDetails extends UserDetail implements UserDetails {

	private static final long serialVersionUID = 1L;
	private SessionData session;

	public CustomUserDetails(UserDetail user, SessionData session) {
		super(user);
		this.session = session;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {

		return AuthorityUtils.commaSeparatedStringToAuthorityList("");
	}

	@Override
	public boolean isAccountNonExpired() {
		// TODO Auto-generated method stub
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

	@Override
	public String getUsername() {
		return super.getUsername();
	}

	@Override
	public String getPassword() {
		return super.getPassword();
	}

	public SessionData getSession() {
		return session;
	}
}
