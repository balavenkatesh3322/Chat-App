package com.spritle.chatapp.security;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.spritle.chatapp.dao.UserDetailRepository;
import com.spritle.chatapp.domain.entities.UserDetail;
import com.spritle.chatapp.domain.pojos.SessionData;
import com.spritle.chatapp.util.AesUtil;

@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {

	
	@Autowired
	UserDetailRepository userDetailRepo;
	
	@Value("${ACTIVE_STATUS}")
	private String ACTIVE_STATUS;

	

	@Override
	@Transactional(rollbackFor = Exception.class)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		AesUtil aesUtil = new AesUtil(128, 1000);
		username = aesUtil.decrypt("f4c5d45368fd3ab73a1fae4c02c7bc9f", "ddf670ea1fd3061aa4c096bae7073ebe",
				"loginpassword", username);
		UserDetail user = userDetailRepo.findByUsernamebyactivestatus(username, ACTIVE_STATUS);
		if (user == null) {
			throw new UsernameNotFoundException("No user present with username: " + username);
		} else {
			
			SessionData session = new SessionData();
			session.setUsername( user.getUsername());
			session.setEmailid(user.getEmail());
			return new CustomUserDetails(user, session);
		}

	}

}
