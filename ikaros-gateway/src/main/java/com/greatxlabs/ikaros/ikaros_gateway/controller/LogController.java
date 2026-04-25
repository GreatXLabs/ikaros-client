package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/logs")
public class LogController {

    private final IkarosSocketClient socketClient;

    public LogController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> verLogs(@RequestHeader("Authorization") String token) {
        String solicitud = "VER_LOGS|" + token;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }
}
