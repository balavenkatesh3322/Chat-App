package com.spritle.chatapp.domain.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userdetail")
public class UserDetail {

	
	
	@Id
	@Column(name = "username")
	String username;

	@Column(name = "gender")
	String gender;

	@Column(name = "dateofbirth")
	String dateofbirth;

	@Column(name = "email")
	String email;

	@Column(name = "nationality")
	String nationality;

	@Column(name = "epassword")
	String password;

	@Column(name = "active_status")
	String activestatus;

	@Column(name = "cruser")
	String cruser;

	@Column(name = "crdate")
	Date crdate;

	@Column(name = "upduser")
	Date upduser;

	@Column(name = "upddate")
	 String upddate;

	public UserDetail() {

	}
	
	public UserDetail(UserDetail userDetail){
		this.username=userDetail.getUsername();
		this.gender=userDetail.getGender();
		
		this.dateofbirth=userDetail.getDateofbirth();
		
		this.email=userDetail.getEmail();
		this.nationality=userDetail.getNationality();
		this.password=userDetail.getPassword();
		this.activestatus=userDetail.getActivestatus();
		this.cruser=userDetail.getCruser();
		this.crdate=userDetail.getCrdate();
		this.upddate=userDetail.getUpddate();
	}
	
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getDateofbirth() {
		return dateofbirth;
	}

	public void setDateofbirth(String dateofbirth) {
		this.dateofbirth = dateofbirth;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getActivestatus() {
		return activestatus;
	}

	public void setActivestatus(String activestatus) {
		this.activestatus = activestatus;
	}

	public String getCruser() {
		return cruser;
	}

	public void setCruser(String cruser) {
		this.cruser = cruser;
	}

	public Date getCrdate() {
		return crdate;
	}

	public void setCrdate(Date crdate) {
		this.crdate = crdate;
	}

	

	public Date getUpduser() {
		return upduser;
	}

	public void setUpduser(Date upduser) {
		this.upduser = upduser;
	}

	public String getUpddate() {
		return upddate;
	}

	public void setUpddate(String upddate) {
		this.upddate = upddate;
	}

	

}
