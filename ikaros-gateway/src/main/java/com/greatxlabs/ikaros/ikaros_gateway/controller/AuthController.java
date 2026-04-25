package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final IkarosSocketClient socketClient;

    public AuthController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String usuario = body.get("usuario");
        String clave = body.get("clave");

        String solicitud = "LOGIN|" + usuario + "|" + clave;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));

        if (res.isOk()) {
            // data viene como "token|ROL"
            String[] parts = res.getData().split("\\|", 2);
            String token = parts[0];
            String rol = parts.length > 1 ? parts[1] : "";
            return ResponseEntity.ok(Map.of("success", true, "token", token, "rol", rol));
        }

        return ResponseEntity.status(401).body(res.toBody());
    }
}
