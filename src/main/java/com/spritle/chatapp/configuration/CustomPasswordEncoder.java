package com.spritle.chatapp.configuration;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import com.spritle.chatapp.util.AesUtil;

public class CustomPasswordEncoder extends BCryptPasswordEncoder {
	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		AesUtil aesUtil = new AesUtil(128, 1000);
		rawPassword = aesUtil.decrypt("f4c5d45368fd3ab73a1fae4c02c7bc9f", "ddf670ea1fd3061aa4c096bae7073ebe",
				"loginpassword", rawPassword.toString());
		return super.matches(rawPassword, encodedPassword);
	}
}
