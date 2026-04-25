package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/eventos")
public class EventoController {

    private final IkarosSocketClient socketClient;

    public EventoController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // REGISTRAR_EVENTO|token|misionID|titulo|descripcion
        String solicitud = "REGISTRAR_EVENTO|" + token + "|" +
                body.get("misionID") + "|" + body.get("titulo") + "|" + body.get("descripcion");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }
}
