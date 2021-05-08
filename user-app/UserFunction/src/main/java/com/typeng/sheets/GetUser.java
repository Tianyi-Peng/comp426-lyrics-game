package com.typeng.sheets;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.HashMap;
import java.util.Map;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.google.gson.Gson;

/**
 * Handler for requests to Lambda function.
 */
public class GetUser implements RequestHandler<Map<String,Object>, Object> {

	
    public Object handleRequest(Map<String,Object> input, Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        
        try {   
        	System.out.println("input map size="+input.size());
        	for(String key:input.keySet()) {
        		System.out.println(key);
        	}
        	System.out.println("end of print out key");
        	Map<String,String> pathParams=(Map<String,String>)input.get("pathParameters");
        	if(pathParams==null)
        		return new GatewayResponse("{}", headers, 500);
        	String username=pathParams.get("username");        	
            UserResponse userResponse= GoogleSheetsService.getUser(username);
            if(userResponse==null)
            	return new GatewayResponse("{}", headers, 500);
            else
            	return new GatewayResponse(new Gson().toJson(userResponse), headers, 200);            
        } catch (IOException | GeneralSecurityException e) {
            return new GatewayResponse("{}", headers, 500);
        }
    }
}
