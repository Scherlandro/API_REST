package com.biontecapi.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/mensagens")
public class MensagemController {

    private List<String> mensagens = new ArrayList<>();

    @GetMapping
    public List<String> getMensagens() {
        return mensagens;
    }

    @GetMapping(path = "/notification")
    public String getNotification() {
        return "Você tem uma nova mensagem em 11-07-2025";
    }

    // Chamado pelo JMS Listener para adicionar mensagens
    public void adicionarMensagem(String mensagem) {
        mensagens.add(mensagem);
    }
}
