package com.typeng.sheets;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.services.sheets.v4.SheetsScopes;

import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.util.Arrays;
import java.util.List;

public class GoogleAuthorizeUtil {
		
    public static Credential serviceAccountAuthorize() throws IOException, GeneralSecurityException {
        InputStream in = GoogleAuthorizeUtil.class.getResourceAsStream("/tianyis-project-4aa1e61f007e.json");
        List<String> scopes = Arrays.asList(SheetsScopes.SPREADSHEETS);
        
        GoogleCredential credential = GoogleCredential.fromStream(in)
        	    .createScoped(scopes);
        
        
        return credential;

    }

}