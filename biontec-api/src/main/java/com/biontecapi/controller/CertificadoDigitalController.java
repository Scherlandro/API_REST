package com.biontecapi.controller;


import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.KeyStore;
import java.security.Security;
import java.security.cert.Certificate;

/*

@SpringBootApplication
public class CertificadoDigitalController {

    public static void main(String[] args) {
        */
/** Adiciona o provedor Bouncy Castle *//*

        Security.addProvider(new BouncyCastleProvider());

        SpringApplication.run(CertificadoDigitalController.class, args);
    }
}
*/

@RestController
@RequestMapping("/api/certificado")
class CertificadoController {

    @GetMapping("/validar")
    public ResponseEntity<String> validarCertificado() {
        try {
            /** Coloque o caminho do seu arquivo de keystore e a senha correspondente*/
            String keystorePath = "caminho/para/seu/certificado.pfx";
            char[] keystorePassword = "suaSenhaDoCertificado".toCharArray();

            /** Tipo de keystore (pode ser PKCS12, JKS, etc.) */
            String keystoreType = "PKCS12";

             /** Alias do certificado no keystore*/
            String alias = "aliasDoCertificado";

            /** Carrega o keystore */
            KeyStore keystore = KeyStore.getInstance(keystoreType);
            keystore.load(getClass().getClassLoader().getResourceAsStream(keystorePath), keystorePassword);

            /** Obtém o certificado */
            Certificate certificate = keystore.getCertificate(alias);

            /** Verifica a validade do certificado (pode incluir outras verificações) */
            certificate.verify(certificate.getPublicKey());

            return ResponseEntity.ok("Certificado válido!");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erro ao validar o certificado");
        }
    }
}