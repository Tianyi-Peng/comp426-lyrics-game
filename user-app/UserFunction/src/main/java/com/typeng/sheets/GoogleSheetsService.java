package com.typeng.sheets;

import java.io.IOException;
import java.math.BigDecimal;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.AppendValuesResponse;
import com.google.api.services.sheets.v4.model.UpdateValuesResponse;
import com.google.api.services.sheets.v4.model.ValueRange;

public class GoogleSheetsService {

    private static Sheets sheetsService;
    
    private static final String SPREADSHEET_ID = "1jzUgJVjSGh2KmYCQkg4Za3FFYp0vlQFq-FJeylFn6K8";
    
    public static boolean createUser(UserRequest userRequest) throws IOException, GeneralSecurityException {
    	
    	if (userRequest == null || userRequest.getUsername() ==null || userRequest.getPassword()==null) {
            System.out.println("Missing user data");
            return false;
        }
    	
    	sheetsService = SheetsServiceUtil.getSheetsService();
    	
        final String range = "User!A1:A";
        ValueRange response = sheetsService.spreadsheets().values()
                .get(SPREADSHEET_ID, range)
                .execute();
        List<List<Object>> values = response.getValues();        
        if (values == null || values.isEmpty()) {
            System.out.println("No data found.");
        } else {
            System.out.println("Number of Users:"+values.size());
            for (List row : values) {
            	if(row.isEmpty())
            		break;
                //System.out.printf("%s\n", row.get(0));                
                if(userRequest.getUsername().equalsIgnoreCase((String)row.get(0))) {
                	System.out.printf("User \"%s\" exists\n", userRequest.getUsername());
                	return false;
                }
            }
        }
        ValueRange user = new ValueRange().setValues(Arrays.asList(Arrays.asList(userRequest.getUsername(),userRequest.getPassword(),userRequest.getBrightness(),userRequest.getHighScore())));        
        AppendValuesResponse appendUserResult = sheetsService.spreadsheets().values().append(SPREADSHEET_ID, "User!A1:D", user).setValueInputOption("USER_ENTERED").setInsertDataOption("INSERT_ROWS").setIncludeValuesInResponse(true).execute();
        ValueRange totalResult = appendUserResult.getUpdates().getUpdatedData();  
       	System.out.println("Create User:");
       	for(Object obj:totalResult.getValues().get(0)) {
       		System.out.println(obj);
       	}
        	
        return true;
        
    }

    public static boolean verifyUser(UserRequest userRequest) throws IOException, GeneralSecurityException {

        if (userRequest == null || userRequest.getUsername() ==null || userRequest.getPassword()==null) {
            System.out.println("Missing user data");
            return false;
        }

    	sheetsService = SheetsServiceUtil.getSheetsService();
    	
        final String range = "User!A1:B";
        ValueRange response = sheetsService.spreadsheets().values()
                .get(SPREADSHEET_ID, range)
                .execute();
        List<List<Object>> values = response.getValues();        
        if (values == null || values.isEmpty()) {
            System.out.println("No data found.");
            return false;
        } else {
            System.out.println("Number of Users:"+values.size());
            for (List row : values) {
            	if(row.isEmpty())
            		break;
                if(userRequest.getUsername().equalsIgnoreCase((String)row.get(0)) && userRequest.getPassword().equalsIgnoreCase((String)row.get(1))) {
                	System.out.printf("User \"%s\" verified\n", userRequest.getUsername());
                	return true;
                }
            }
        }
        
        return false;        
    }
 
    public static boolean updateUser(UserRequest userRequest) throws IOException, GeneralSecurityException {
    	
        if (userRequest == null || userRequest.getUsername() ==null) {
            System.out.println("Missing user data");
            return false;
        }
        
    	sheetsService = SheetsServiceUtil.getSheetsService();
    	
        final String range = "User!A1:A";
        ValueRange response = sheetsService.spreadsheets().values()
                .get(SPREADSHEET_ID, range)
                .execute();
        List<List<Object>> values = response.getValues();
        int rowCount=0;
        boolean exist=false;
        if (values == null || values.isEmpty()) {
            System.out.println("No data found.");
            return false;
        } else {
            System.out.println("Number of Users:"+values.size());
            for (List row : values) {            	
            	if(row.isEmpty())
            		break;           
            	rowCount++;
                //System.out.printf("%s\n", row.get(0));                
                if(userRequest.getUsername().equalsIgnoreCase((String)row.get(0))) {
                	System.out.printf("User \"%s\" exists\n", userRequest.getUsername());
                	if(userRequest.getPassword()==null)
                		userRequest.setPassword((String)row.get(1));
                	if(userRequest.getBrightness()==null && row.get(2)!=null && !((String)row.get(2)).isEmpty())
                		userRequest.setBrightness(Boolean.valueOf((String)row.get(2)));
                	if(userRequest.getHighScore()==null && row.get(3)!=null && !((String)row.get(3)).isEmpty())
                		userRequest.setHighScore(new BigDecimal((String)row.get(3)));
                	exist=true;
                	break;
                }                
            }
        }
        
        if(!exist) {
        	System.out.printf("User \"%s\" doesn't exist", userRequest.getUsername());
        	return false;
        }

        System.out.printf("Rows to be updated:%d", rowCount);
                
        ValueRange user = new ValueRange().setValues(Arrays.asList(Arrays.asList(userRequest.getUsername(),userRequest.getPassword(),userRequest.getBrightness(),userRequest.getHighScore())));        
        UpdateValuesResponse updateUserResult = sheetsService.spreadsheets().values().update(SPREADSHEET_ID, "User!A"+rowCount+":D"+rowCount, user).setValueInputOption("USER_ENTERED").setIncludeValuesInResponse(true).execute();
        ValueRange totalResult = updateUserResult.getUpdatedData();   
       	System.out.println("Updated User:");
       	for(Object obj:totalResult.getValues().get(0)) {
       		System.out.println(obj);
       	}
        return true;
        
    }

    public static UserResponse getUser(String username) throws IOException, GeneralSecurityException {
    	
    	
        if (username == null ) {
            System.out.println("Missing username");
            return null;
        }
        
    	sheetsService = SheetsServiceUtil.getSheetsService();
    	
        final String range = "User!A1:D";
        ValueRange response = sheetsService.spreadsheets().values()
                .get(SPREADSHEET_ID, range)
                .execute();
        List<List<Object>> values = response.getValues();
        if (values == null || values.isEmpty()) {
            System.out.println("No data found.");
            return null;
        } else {
            System.out.println("Number of Users:"+values.size());
            for (List row : values) {            	
            	if(row.isEmpty())
            		break;           
                //System.out.printf("%s\n", row.get(0));                
                if(username.equalsIgnoreCase((String)row.get(0))) {
                	System.out.printf("User \"%s\" exists\n", username);
                	UserResponse userResponse=new UserResponse();
                	userResponse.setUsername(username);                	                	
                	if(row.get(2)!=null && !((String)row.get(2)).isEmpty())
                		userResponse.setBrightness(Boolean.valueOf((String)row.get(2)));
                	if(row.get(3)!=null && !((String)row.get(3)).isEmpty())
                		userResponse.setHighScore(new BigDecimal((String)row.get(3)));
                	System.out.println("return userResponse:"+userResponse);
                	return userResponse;
                }                
            }
        }
        
        return null;
    }

}