package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class ControladorLogs {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorLogs(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> obtenerLogs(@RequestHeader("Authorization") String token) {
        String solicitud = "VER_LOGS|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
