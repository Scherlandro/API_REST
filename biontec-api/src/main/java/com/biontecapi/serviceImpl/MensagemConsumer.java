package com.biontecapi.serviceImpl;

import com.biontecapi.controller.MensagemController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

@Component
public class MensagemConsumer {

    @Autowired
    private SimpMessagingTemplate websocket;

    @Autowired
    private MensagemController mensagemController;

    @JmsListener(destination = "fila.exemplo")
    public void consumirDaFila(String mensagem) {
        String msg = "FILA: " + mensagem;
        mensagemController.adicionarMensagem(msg);
        websocket.convertAndSend("/topic/mensagens", msg);
    }

    @JmsListener(destination = "topico.exemplo")
    public void consumirDoTopico(String mensagem) {
        String msg = "TÓPICO: " + mensagem;
        mensagemController.adicionarMensagem(msg);
        websocket.convertAndSend("/topic/mensagens", msg);
    }
}