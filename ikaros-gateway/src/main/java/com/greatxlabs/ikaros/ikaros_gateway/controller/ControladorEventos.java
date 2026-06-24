package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class ControladorEventos {

    private final ClienteSocketIkaros clienteSocket;
    private final RegistradorLogs registradorLogs;
    private final SesionGateway sesionGateway;

    public ControladorEventos(ClienteSocketIkaros clienteSocket, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
        this.clienteSocket = clienteSocket;
        this.registradorLogs = registradorLogs;
        this.sesionGateway = sesionGateway;
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
        String solicitud = "REGISTRAR_EVENTO|" + token + "|" + cuerpo.get("misionID") + "|" + cuerpo.get("titulo") + "|" + cuerpo.get("descripcion");
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        if (respuesta.esExitosa()) {
            Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
            if (usuarioID != null) {
                String detalles = "titulo=" + cuerpo.get("titulo") + "|descripcion=" + cuerpo.get("descripcion") + "|misionID=" + cuerpo.get("misionID");
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_REGISTRAR_EVENTO, RegistradorLogs.ENT_EVENTO, 0, detalles);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> darDeBajaEvento(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "BAJA_EVENTO|" + token + "|" + id;
        RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

        if (respuesta.esExitosa()) {
            Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
            if (usuarioID != null) {
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_DESESTIMAR_EVENTO, RegistradorLogs.ENT_EVENTO, id, "eventoID=" + id);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
