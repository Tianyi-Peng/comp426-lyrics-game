package com.typeng.sheets;

import java.math.BigDecimal;

public class UserRequest {
	private String username;
	private String password;
	private Boolean brightness;
	private BigDecimal highScore;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Boolean getBrightness() {
		return brightness;
	}

	public void setBrightness(Boolean brightness) {
		this.brightness = brightness;
	}

	public BigDecimal getHighScore() {
		return highScore;
	}

	public void setHighScore(BigDecimal highScore) {
		this.highScore = highScore;
	}

}
