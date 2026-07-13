package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.util.SanitizadorProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class ControladorEventos {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorEventos(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @GetMapping("/listar")
    public ResponseEntity<Map<String, Object>> listarTodosEventos(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_EVENTOS|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarEventosPorMision(@RequestParam int misionID, @RequestHeader("Authorization") String token) {
        String solicitud = "CONSULTAR_EVENTOS|" + token + "|" + misionID;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarEvento(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "REGISTRAR_EVENTO|" + token + "|" + cuerpo.get("misionID") + "|" + SanitizadorProtocolo.sanitizar(cuerpo.get("titulo")) + "|" + SanitizadorProtocolo.sanitizar(cuerpo.get("descripcion"));
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBajaEvento(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "BAJA_EVENTO|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
