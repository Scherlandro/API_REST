package com.biontecapi.security;

import org.springframework.stereotype.Component;
import javax.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;

@Component
public class EfiSecurityComponent {

    private final List<String> EFI_IPS = Arrays.asList(
            "34.193.116.226",
            "3.230.134.5",
            "54.234.204.149",
            "127.0.0.1",
            "0:0:0:0:0:0:0:1"
    );

    public boolean isRequestFromEfi(HttpServletRequest request) {
        String clientIp = request.getHeader("X-Forwarded-For");

        if (clientIp == null || clientIp.isEmpty()) {
            clientIp = request.getRemoteAddr();
        } else {
            clientIp = clientIp.split(",")[0].trim();
        }

        return EFI_IPS.contains(clientIp);
    }
}