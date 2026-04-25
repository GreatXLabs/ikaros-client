package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class ControladorUsuarios {

    private final ClienteSocketIkaros clienteSocket;

    public ControladorUsuarios(ClienteSocketIkaros clienteSocket) {
        this.clienteSocket = clienteSocket;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "REGISTRAR_USUARIO|" + token + "|" + cuerpo.get("usuario") + "|" + cuerpo.get("clave") + "|" + cuerpo.get("rol");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> modificarUsuario(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "MODIFICAR_USUARIO|" + token + "|" + cuerpo.get("usuario") + "|" + cuerpo.get("clave") + "|" + cuerpo.get("rol");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @DeleteMapping("/{usuario}")
    public ResponseEntity<Map<String, Object>> darDeBajaUsuario(@PathVariable String usuario, @RequestHeader("Authorization") String token) {
        String solicitud = "BAJA_USUARIO|" + token + "|" + usuario;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
