package com.typeng.sheets;

import java.math.BigDecimal;

public class UserResponse {
	private String username;
	private Boolean brightness;
	private BigDecimal highScore;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	@Override
	public String toString() {
		return "UserResponse [username=" + username + ", brightness=" + brightness + ", highScore=" + highScore + "]";
	}

	
}
