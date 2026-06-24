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
				String detalles = "nombre=" + cuerpo.get("nombre") + "|descripcion=" + cuerpo.get("descripcion") + "|fechaInicio=" + cuerpo.get("fechaInicio") + "|fechaFin=" + cuerpo.get("fechaFin");
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_CREAR_MISION, RegistradorLogs.ENT_MISION, 0, detalles);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> modificarMision(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		// Fetch old values for diff
		String rawVieja = clienteSocket.enviarSolicitud("CONSULTAR_MISION|" + token + "|" + id);
		Map<String, String> vieja = new java.util.HashMap<>();
		if (rawVieja != null && rawVieja.startsWith("OK")) {
			String data = rawVieja.substring(rawVieja.indexOf('|') + 1);
			String[] parts = data.split("\\|");
			if (parts.length >= 8) {
				vieja.put("nombre", parts[1] != null ? parts[1] : "");
				vieja.put("descripcion", parts[2] != null ? parts[2] : "");
				vieja.put("fechaInicio", parts[4] != null ? parts[4] : "");
				vieja.put("fechaFin", parts[5] != null ? parts[5] : "");
			}
		}

		String solicitud = "MODIFICAR_MISION|" + token + "|" + id + "|" + cuerpo.get("nombre") + "|" + cuerpo.get("descripcion") + "|" + cuerpo.get("fechaInicio") + "|" + cuerpo.get("fechaFin");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				StringBuilder detalles = new StringBuilder();
				String[][] campos = {{"nombre", "Nombre"}, {"descripcion", "Descripción"}, {"fechaInicio", "Fecha inicio"}, {"fechaFin", "Fecha fin"}};
				String[] keys = {"nombre", "descripcion", "fechaInicio", "fechaFin"};
				for (int i = 0; i < keys.length; i++) {
					String oldVal = vieja.getOrDefault(keys[i], "");
					String newVal = cuerpo.getOrDefault(keys[i], "");
					if (!oldVal.equals(newVal)) {
						if (detalles.length() > 0) detalles.append("|");
						detalles.append(campos[i][1]).append(":").append(oldVal).append("->").append(newVal);
					}
				}
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_MISION, RegistradorLogs.ENT_MISION, id, detalles.toString());
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
				String detalles = "Estado:" + estado;
				if (retrasoInicio != null && !retrasoInicio.isEmpty()) detalles += "|retrasoInicio=" + retrasoInicio;
				if (retrasoFin != null && !retrasoFin.isEmpty()) detalles += "|retrasoFin=" + retrasoFin;
				registradorLogs.registrar(usuarioID, accionID, RegistradorLogs.ENT_MISION, id, detalles);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}
}
