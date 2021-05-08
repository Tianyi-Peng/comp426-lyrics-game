package com.typeng.sheets;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.reactive.function.client.WebClient;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

import reactor.core.publisher.Mono;

/**
 * Handler for requests to Lambda function.
 */
public class GetSong implements RequestHandler<Map<String,Object>, Object> {

	
    public Object handleRequest(Map<String,Object> input, Context context) {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Custom-Header", "application/json");
        headers.put("Access-Control-Allow-Origin", "*");
        
    	Map<String,String> pathParams=(Map<String,String>)input.get("queryStringParameters");
    	if(pathParams==null)
    		return new GatewayResponse("{}", headers, 500);
    	String track_id=pathParams.get("track_id");        	
    	String apikey=pathParams.get("apikey");
    	System.out.println("trace_Id="+track_id);
    	System.out.println("apikey="+apikey);    	
        String response= getSong(track_id,apikey);
        if(response==null)
        	return new GatewayResponse("{}", headers, 500);
        else
        	return new GatewayResponse(response, headers, 200);
    }
    
    public String getSong(String trackId,String apikey) {
    	WebClient client=WebClient.create("https://api.musixmatch.com");
    	Mono<String> result=client.get().uri(uriBuilder -> uriBuilder.path("/ws/1.1/track.get").queryParam("track_id", trackId).queryParam("apikey",apikey).build()).retrieve().bodyToMono(String.class);
    	return result.block();
    }
    
    public static void main(String args[]) {
    	GetSong getSong=new GetSong();
    	getSong.getSong("15953433","4c6c268c5ec5c4d7ac705f11e4c4bb45");
    }
}
