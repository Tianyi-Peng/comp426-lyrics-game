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
public class VerifyUser implements RequestHandler<Map<String,Object>, Object> {

	
    public Object handleRequest(Map<String,Object> input, Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        try {                    	
        	String body=(String)input.get("body");
        	if(body==null)        		
            	return new GatewayResponse("{}", headers, 500);
        	UserRequest userRequest=new Gson().fromJson(body, UserRequest.class);        	
            boolean success= GoogleSheetsService.verifyUser(userRequest);            
            return new GatewayResponse(new Gson().toJson(new SuccessResponse(success)), headers, 200);
        } catch (IOException | GeneralSecurityException e) {
            return new GatewayResponse("{}", headers, 500);
        }
    }
}
