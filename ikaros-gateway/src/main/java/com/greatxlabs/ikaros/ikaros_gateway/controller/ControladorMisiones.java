package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/misiones")
public class ControladorMisiones {

	private final ClienteSocketIkaros clienteSocket;
	private final RegistradorLogs registradorLogs;
	private final SesionGateway sesionGateway;

	public ControladorMisiones(ClienteSocketIkaros clienteSocket, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
		this.clienteSocket = clienteSocket;
		this.registradorLogs = registradorLogs;
		this.sesionGateway = sesionGateway;
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> listarActivas(@RequestHeader("Authorization") String token) {
		String solicitud = "LISTAR_MISIONES|" + token;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> consultarPorId(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "CONSULTAR_MISION|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/{id}/tripulantes")
	public ResponseEntity<Map<String, Object>> listarTripulantesMision(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "LISTAR_TRIPULANTES_MISION|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> registrarMision(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String solicitud = "REGISTRAR_MISION|" + token + "|1|" + cuerpo.get("nombre") + "|" + cuerpo.get("descripcion") + "|" + cuerpo.get("fechaInicio") + "|" + cuerpo.get("fechaFin");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_CREAR_MISION, RegistradorLogs.ENT_MISION, 0);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PatchMapping("/{id}/estado")
	public ResponseEntity<Map<String, Object>> actualizarEstadoMision(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String retrasoInicio = cuerpo.getOrDefault("retrasoInicio", "");
			String retrasoFin = cuerpo.getOrDefault("retrasoFin", "");
			String solicitud = "ACTUALIZAR_ESTADO_MISION|" + token + "|" + id + "|" + cuerpo.get("estado") + "|" + retrasoInicio + "|" + retrasoFin;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				String estado = cuerpo.get("estado");
				int accionID = "FINALIZADA".equalsIgnoreCase(estado) ? RegistradorLogs.ACC_FINALIZAR_MISION : RegistradorLogs.ACC_CANCELAR_MISION;
				registradorLogs.registrar(usuarioID, accionID, RegistradorLogs.ENT_MISION, id);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}
}
