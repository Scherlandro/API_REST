package com.biontecapi.controller;

import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.io.FileInputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.Security;
import java.security.cert.Certificate;

public class CertificadoDigital {

    public static void main(String[] args) {
        try {
            // Adiciona o provedor Bouncy Castle
            Security.addProvider(new BouncyCastleProvider());

            // Caminho para o arquivo do keystore (pode ser .pfx, .p12, etc.)
            String keystorePath = "caminho/para/seu/certificado.pfx";
            char[] keystorePassword = "suaSenhaDoCertificado".toCharArray();

            // Tipo de keystore (pode ser PKCS12, JKS, etc.)
            String keystoreType = "PKCS12";

            // Alias do certificado no keystore
            String alias = "aliasDoCertificado";

            // Carrega o keystore
            KeyStore keystore = KeyStore.getInstance(keystoreType);
            keystore.load(new FileInputStream(keystorePath), keystorePassword);

            // Obtém a chave privada do certificado
            PrivateKey privateKey = (PrivateKey) keystore.getKey(alias, keystorePassword);

            // Obtém o certificado
            Certificate certificate = keystore.getCertificate(alias);

            // Faça o que for necessário com a chave privada e o certificado
            System.out.println("Chave privada: " + privateKey);
            System.out.println("Certificado: " + certificate);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
/*
Certifique-se de substituir os valores das variáveis ​​keystorePath, keystorePassword, keystoreType
e alias pelos valores correspondentes do seu certificado digital. Este é apenas um exemplo básico,
 e dependendo do seu caso de uso, você pode precisar de funcionalidades adicionais,
 como verificar a validade do certificado, assinar e verificar assinaturas digitais,
  entre outros. Certifique-se de consultar a documentação do Bouncy Castle para obter mais informações
   e detalhes específicos.
 */
