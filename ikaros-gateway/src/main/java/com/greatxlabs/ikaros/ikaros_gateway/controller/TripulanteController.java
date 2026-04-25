package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tripulantes")
public class TripulanteController {

    private final IkarosSocketClient socketClient;

    public TripulanteController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_TRIPULANTES|" + token;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> consultar(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "CONSULTAR_TRIPULANTE|" + token + "|" + id;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // REGISTRAR_TRIPULANTE|token|tripulanteID|nombre|fechaNacimiento|peso|altura
        String solicitud = "REGISTRAR_TRIPULANTE|" + token + "|" +
                body.get("tripulanteID") + "|" + body.get("nombre") + "|" +
                body.get("fechaNacimiento") + "|" + body.get("peso") + "|" + body.get("altura");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> modificar(@PathVariable int id, @RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // MODIFICAR_TRIPULANTE|token|tripulanteID|nombre|fechaNacimiento|peso|altura
        String solicitud = "MODIFICAR_TRIPULANTE|" + token + "|" + id + "|" +
                body.get("nombre") + "|" + body.get("fechaNacimiento") + "|" +
                body.get("peso") + "|" + body.get("altura");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> baja(@PathVariable int id, @RequestHeader("Authorization") String token) {
        // BAJA_TRIPULANTE|token|tripulanteID
        String solicitud = "BAJA_TRIPULANTE|" + token + "|" + id;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }
}
