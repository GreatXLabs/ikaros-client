package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/estados")
public class ControladorEstados {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorEstados(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @GetMapping("/misiones")
    public ResponseEntity<Map<String, Object>> listarEstadosMisiones(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_ESTADOS_MISIONES|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @GetMapping("/tripulantes")
    public ResponseEntity<Map<String, Object>> listarEstadosTripulantes(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_ESTADOS_TRIPULANTES|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @GetMapping("/eventos")
    public ResponseEntity<Map<String, Object>> listarEstadosEventos(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_ESTADOS_EVENTOS|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
