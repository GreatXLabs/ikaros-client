package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class ControladorUsuarios {

    private final ClienteSocketIkaros clienteSocket;
    private final RegistradorLogs registradorLogs;
    private final SesionGateway sesionGateway;

    public ControladorUsuarios(ClienteSocketIkaros clienteSocket, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
        this.clienteSocket = clienteSocket;
        this.registradorLogs = registradorLogs;
        this.sesionGateway = sesionGateway;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarUsuarios(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_USUARIOS|" + token;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    // REGISTRAR_USUARIO|token|usuario|clave|nombre|apellido|rol
    @PostMapping
    public ResponseEntity<Map<String, Object>> registrarUsuario(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "REGISTRAR_USUARIO|" + token + "|"
                + cuerpo.get("usuario") + "|"
                + cuerpo.get("clave") + "|"
                + cuerpo.getOrDefault("nombre", "") + "|"
                + cuerpo.getOrDefault("apellido", "") + "|"
                + cuerpo.get("rol");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        if (respuesta.esExitosa()) {
            Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
            if (usuarioID != null) {
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_ALTA_USUARIO, RegistradorLogs.ENT_USUARIO, 0);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    // MODIFICAR_USUARIO|token|usuarioID|usuario|clave|nombre|apellido|rol
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> modificarUsuario(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        String solicitud = "MODIFICAR_USUARIO|" + token + "|"
                + id + "|"
                + cuerpo.get("usuario") + "|"
                + cuerpo.get("clave") + "|"
                + cuerpo.getOrDefault("nombre", "") + "|"
                + cuerpo.getOrDefault("apellido", "") + "|"
                + cuerpo.get("rol");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        if (respuesta.esExitosa()) {
            Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
            if (usuarioID != null) {
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_USUARIO, RegistradorLogs.ENT_USUARIO, 0);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    // BAJA_USUARIO|token|usuarioID
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBajaUsuario(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "BAJA_USUARIO|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        if (respuesta.esExitosa()) {
            Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
            if (usuarioID != null) {
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_USUARIO, RegistradorLogs.ENT_USUARIO, 0);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
