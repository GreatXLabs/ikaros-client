package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.MinioService;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/tripulantes")
public class ControladorTripulantes {

	private final ClienteSocketIkaros clienteSocket;
	private final MinioService minioService;
	private final RegistradorLogs registradorLogs;
	private final SesionGateway sesionGateway;

	public ControladorTripulantes(ClienteSocketIkaros clienteSocket, MinioService minioService, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
		this.clienteSocket = clienteSocket;
		this.minioService = minioService;
		this.registradorLogs = registradorLogs;
		this.sesionGateway = sesionGateway;
	}

	@GetMapping
	public ResponseEntity<Map<String, Object>> listarTripulantes(@RequestHeader("Authorization") String token) {
		String solicitud = "LISTAR_TRIPULANTES|" + token;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/aptitudes")
	public ResponseEntity<Map<String, Object>> consultarAptitudes(@RequestHeader("Authorization") String token) {
		String solicitud = "CONSULTAR_APTITUDES|" + token;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/{id}")
	public ResponseEntity<Map<String, Object>> consultarTripulantePorId(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "CONSULTAR_TRIPULANTE|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/{id}/misiones")
	public ResponseEntity<Map<String, Object>> listarMisionesTripulante(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "LISTAR_MISIONES_TRIPULANTE|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@GetMapping("/{id}/capacidades")
	public ResponseEntity<Map<String, Object>> consultarCapacidades(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "CONSULTAR_CAPACIDADES|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PostMapping("/{id}/capacidades")
	public ResponseEntity<Map<String, Object>> guardarCapacidades(@PathVariable int id, @RequestBody java.util.List<java.util.Map<String, String>> capacidades, @RequestHeader("Authorization") String token) {
		// Primero eliminar las existentes
		String solEliminar = "ELIMINAR_CAPACIDADES|" + token + "|" + id;
		clienteSocket.enviarSolicitud(solEliminar);
		// Luego registrar cada una
		for (java.util.Map<String, String> cap : capacidades) {
			String solRegistrar = "REGISTRAR_CAPACIDAD|" + token + "|" + id + "|" + cap.get("aptitudID") + "|" + cap.get("calificacion") + "|" + (cap.getOrDefault("fechaExamen", ""));
			clienteSocket.enviarSolicitud(solRegistrar);
		}
		return ResponseEntity.ok(Map.of("success", true, "message", "Capacidades guardadas"));
	}

	@PostMapping("/asignar")
	public ResponseEntity<Map<String, Object>> asignarMision(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String tripulanteId = cuerpo.getOrDefault("tripulanteId", "");
		String misionId = cuerpo.getOrDefault("misionId", "");
		String solicitud = "ASIGNAR_TRIPULANTE|" + token + "|" + tripulanteId + "|" + misionId;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));
		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PostMapping("/imagen")
	public ResponseEntity<Map<String, Object>> subirImagen(@RequestParam("imagen") MultipartFile archivo) {
		if (archivo.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Archivo vacío"));
		}

		try {
			String path = minioService.subirImagen(archivo);
			return ResponseEntity.ok(Map.of("success", true, "path", path));
		} catch (RuntimeException e) {
			return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error al subir la imagen: " + e.getMessage()));
		}
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> registrarTripulante(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String solicitud = "REGISTRAR_TRIPULANTE|" + token + "|" + cuerpo.getOrDefault("sexo", "M") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura") + "|" + cuerpo.getOrDefault("nombre", "") + "|" + cuerpo.getOrDefault("apellido", "") + "|" + cuerpo.getOrDefault("imagen", "");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				String detalles = "nombre=" + cuerpo.getOrDefault("nombre", "") + "|apellido=" + cuerpo.getOrDefault("apellido", "") + "|sexo=" + cuerpo.getOrDefault("sexo", "M") + "|fechaNacimiento=" + cuerpo.get("fechaNacimiento") + "|peso=" + cuerpo.get("peso") + "|altura=" + cuerpo.get("altura");
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_ALTA_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, 0, detalles);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> modificarTripulante(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		// Fetch old values for diff
		String rawVieja = clienteSocket.enviarSolicitud("CONSULTAR_TRIPULANTE|" + token + "|" + id);
		Map<String, String> vieja = new java.util.HashMap<>();
		if (rawVieja != null && rawVieja.startsWith("OK")) {
			String data = rawVieja.substring(rawVieja.indexOf('|') + 1);
			String[] parts = data.split("\\|");
			if (parts.length >= 8) {
				vieja.put("nombre", parts[1] != null ? parts[1] : "");
				vieja.put("apellido", parts[2] != null ? parts[2] : "");
				vieja.put("sexo", parts[3] != null ? parts[3] : "");
				vieja.put("fechaNacimiento", parts[4] != null ? parts[4] : "");
				vieja.put("peso", parts[5] != null ? parts[5] : "");
				vieja.put("altura", parts[6] != null ? parts[6] : "");
				vieja.put("estado", parts[7] != null ? parts[7] : "");
			}
		}

		String solicitud = "MODIFICAR_TRIPULANTE|" + token + "|" + id + "|" + cuerpo.getOrDefault("estado", "ACTIVO") + "|" + cuerpo.getOrDefault("sexo", "M") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura") + "|" + cuerpo.getOrDefault("nombre", "") + "|" + cuerpo.getOrDefault("apellido", "") + "|" + cuerpo.getOrDefault("imagen", "");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				StringBuilder detalles = new StringBuilder();
				String[][] campos = {{"estado", "Estado"}, {"sexo", "Sexo"}, {"fechaNacimiento", "Fecha nacimiento"}, {"peso", "Peso"}, {"altura", "Altura"}, {"nombre", "Nombre"}, {"apellido", "Apellido"}};
				String[] keys = {"estado", "sexo", "fechaNacimiento", "peso", "altura", "nombre", "apellido"};
				for (int i = 0; i < keys.length; i++) {
					String oldVal = vieja.getOrDefault(keys[i], "");
					String newVal = cuerpo.getOrDefault(keys[i], "");
					if (!oldVal.equals(newVal)) {
						if (detalles.length() > 0) detalles.append("|");
						detalles.append(campos[i][1]).append(":").append(oldVal).append("->").append(newVal);
					}
				}
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, id, detalles.toString());
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> darDeBajaTripulante(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "BAJA_TRIPULANTE|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_BAJA_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, id, "tripulanteID=" + id);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}
}
