package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/misiones")
public class ControladorMisiones {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorMisiones(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarActivas(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_MISIONES_ACTIVAS|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> consultarPorId(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "CONSULTAR_MISION|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarMision(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "REGISTRAR_MISION|" + token + "|1|" + cuerpo.get("nombre") + "|" + cuerpo.get("descripcion") + "|" + cuerpo.get("fechaInicio") + "|" + cuerpo.get("fechaFin");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> actualizarEstadoMision(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "ACTUALIZAR_ESTADO_MISION|" + token + "|" + id + "|" + cuerpo.get("estado");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
