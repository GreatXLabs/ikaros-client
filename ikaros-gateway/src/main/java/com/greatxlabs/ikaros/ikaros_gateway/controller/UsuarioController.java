package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final IkarosSocketClient socketClient;

    public UsuarioController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // REGISTRAR_USUARIO|token|usuario|clave|rol
        String solicitud = "REGISTRAR_USUARIO|" + token + "|" +
                body.get("usuario") + "|" + body.get("clave") + "|" + body.get("rol");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> modificar(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // MODIFICAR_USUARIO|token|usuario|clave|rol
        String solicitud = "MODIFICAR_USUARIO|" + token + "|" +
                body.get("usuario") + "|" + body.get("clave") + "|" + body.get("rol");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @DeleteMapping("/{usuario}")
    public ResponseEntity<Map<String, Object>> baja(@PathVariable String usuario, @RequestHeader("Authorization") String token) {
        // BAJA_USUARIO|token|usuario
        String solicitud = "BAJA_USUARIO|" + token + "|" + usuario;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }
}
