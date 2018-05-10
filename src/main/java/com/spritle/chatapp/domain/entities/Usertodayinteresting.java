package com.spritle.chatapp.domain.entities;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "usertodayinteresting")
public class Usertodayinteresting {

	@Id
	@GeneratedValue(strategy = javax.persistence.GenerationType.IDENTITY )
	@Column(name = "interestingid")
	private int interestingid;
	@Column(name = "crusername")
	private String crusername;
	@Column(name = "intrestingdata")
	private String intrestingdata;
	@Column(name = "crdate")
	private Date crdate;
	@Column(name = "upduser")
	private String upduser;
	@Column(name = "upddate")
	private Date upddate;
	@Column(name = "activestatus")
	private String activestatus;
	
	@Transient
	private int likescount;
	
	@Transient
	private int commentscount;
	
	@Transient
	private boolean userhaslike;
	
	
	
	
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
	public String getIntrestingdata() {
		return intrestingdata;
	}
	public void setIntrestingdata(String intrestingdata) {
		this.intrestingdata = intrestingdata;
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
	
	public int getLikescount() {
		return likescount;
	}
	public void setLikescount(int likescount) {
		this.likescount = likescount;
	}
	public int getCommentscount() {
		return commentscount;
	}
	public void setCommentscount(int commentscount) {
		this.commentscount = commentscount;
	}
	public boolean isUserhaslike() {
		return userhaslike;
	}
	public void setUserhaslike(boolean userhaslike) {
		this.userhaslike = userhaslike;
	}
	
	

	
	
}
