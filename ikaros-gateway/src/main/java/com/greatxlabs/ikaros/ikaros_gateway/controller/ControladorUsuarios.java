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
                String detalles = "usuario=" + cuerpo.get("usuario") + "|nombre=" + cuerpo.getOrDefault("nombre", "") + "|apellido=" + cuerpo.getOrDefault("apellido", "") + "|rol=" + cuerpo.get("rol");
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_ALTA_USUARIO, RegistradorLogs.ENT_USUARIO, 0, detalles);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }

    // MODIFICAR_USUARIO|token|usuarioID|usuario|clave|nombre|apellido|rol
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> modificarUsuario(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
        // Fetch old values via LISTAR_USUARIOS and find this user
        String rawLista = clienteSocket.enviarSolicitud("LISTAR_USUARIOS|" + token);
        Map<String, String> vieja = new java.util.HashMap<>();
        if (rawLista != null && rawLista.startsWith("OK")) {
            String data = rawLista.substring(rawLista.indexOf('|') + 1);
            // Users come as semicolon-delimited records, tilde-delimited fields
            String[] records = data.split(";");
            for (String record : records) {
                String[] fields = record.split("~");
                if (fields.length >= 7) {
                    try {
                        int uid = Integer.parseInt(fields[0]);
                        if (uid == id) {
                            vieja.put("usuario", fields[1] != null ? fields[1] : "");
                            vieja.put("nombre", fields[2] != null ? fields[2] : "");
                            vieja.put("apellido", fields[3] != null ? fields[3] : "");
                            vieja.put("rol", fields[5] != null ? fields[5] : "");
                            break;
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

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
                StringBuilder detalles = new StringBuilder();
                String[][] campos = {{"usuario", "Usuario"}, {"nombre", "Nombre"}, {"apellido", "Apellido"}, {"rol", "Rol"}};
                String[] keys = {"usuario", "nombre", "apellido", "rol"};
                for (int i = 0; i < keys.length; i++) {
                    String oldVal = vieja.getOrDefault(keys[i], "");
                    String newVal = cuerpo.getOrDefault(keys[i], "");
                    if (!oldVal.equals(newVal)) {
                        if (detalles.length() > 0) detalles.append("|");
                        detalles.append(campos[i][1]).append(":").append(oldVal).append("->").append(newVal);
                    }
                }
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_USUARIO, RegistradorLogs.ENT_USUARIO, id, detalles.toString());
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
                registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_USUARIO, RegistradorLogs.ENT_USUARIO, id, "usuarioID=" + id);
            }
        }

        return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
    }
}
