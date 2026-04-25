package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.ProtocolResponse;
import com.greatxlabs.ikaros.ikaros_gateway.socket.IkarosSocketClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/misiones")
public class MisionController {

    private final IkarosSocketClient socketClient;

    public MisionController(IkarosSocketClient socketClient) {
        this.socketClient = socketClient;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(@RequestHeader("Authorization") String token) {
        String solicitud = "LISTAR_MISIONES_ACTIVAS|" + token;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> consultar(@PathVariable int id, @RequestHeader("Authorization") String token) {
        String solicitud = "CONSULTAR_MISION|" + token + "|" + id;
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // REGISTRAR_MISION|token|estadoMID|nombre|descripcion|fecha_ini|fecha_fin
        String solicitud = "REGISTRAR_MISION|" + token + "|1|" +
                body.get("nombre") + "|" + body.get("descripcion") + "|" +
                body.get("fechaInicio") + "|" + body.get("fechaFin");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<Map<String, Object>> actualizarEstado(@PathVariable int id, @RequestBody Map<String, String> body, @RequestHeader("Authorization") String token) {
        // ACTUALIZAR_ESTADO_MISION|token|misionID|estado
        String solicitud = "ACTUALIZAR_ESTADO_MISION|" + token + "|" + id + "|" + body.get("estado");
        ProtocolResponse res = ProtocolResponse.from(socketClient.enviar(solicitud));
        return ResponseEntity.ok(res.toBody());
    }
}
