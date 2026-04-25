package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tripulantes")
public class ControladorTripulantes {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorTripulantes(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarTripulantes(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_TRIPULANTES|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> consultarTripulantePorId(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "CONSULTAR_TRIPULANTE|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarTripulante(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "REGISTRAR_TRIPULANTE|" + token + "|" + cuerpo.get("tripulanteID") + "|" + cuerpo.get("nombre") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> modificarTripulante(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "MODIFICAR_TRIPULANTE|" + token + "|" + id + "|" + cuerpo.get("nombre") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBajaTripulante(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "BAJA_TRIPULANTE|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
