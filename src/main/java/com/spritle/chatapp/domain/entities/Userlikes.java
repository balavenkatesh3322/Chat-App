package com.spritle.chatapp.domain.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "userlikes")
public class Userlikes {

	
	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY)
	@Column(name = "likesid")
	private int likesid;
	@Column(name = "interestingid")
	private int interestingid;
	
		
	
	@Column(name = "crusername")
	private String crusername;
	@Column(name = "crdate")
	private Date crdate;
	@Column(name = "upduser")
	private String upduser;
	@Column(name = "upddate")
	private Date upddate;
	@Column(name = "activestatus")
	private String activestatus;
	public int getLikesid() {
		return likesid;
	}
	public void setLikesid(int likesid) {
		this.likesid = likesid;
	}
	public int getInterestingid() {
		return interestingid;
	}
	public void setInterestingid(int interestingid) {
		this.interestingid = interestingid;
	}
	public String getCrusername() {
		return crusername;
	}
	public void setCrusername(String crusername) {
		this.crusername = crusername;
	}
	public Date getCrdate() {
		return crdate;
	}
	public void setCrdate(Date crdate) {
		this.crdate = crdate;
	}
	public String getUpduser() {
		return upduser;
	}
	public void setUpduser(String upduser) {
		this.upduser = upduser;
	}
	public Date getUpddate() {
		return upddate;
	}
	public void setUpddate(Date upddate) {
		this.upddate = upddate;
	}
	public String getActivestatus() {
		return activestatus;
	}
	public void setActivestatus(String activestatus) {
		this.activestatus = activestatus;
	}
	
	
	
	
}
