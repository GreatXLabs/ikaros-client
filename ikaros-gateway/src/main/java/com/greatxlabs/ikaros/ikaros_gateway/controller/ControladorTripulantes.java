package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.MinioService;
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

	public ControladorTripulantes(ClienteSocketIkaros clienteSocket, MinioService minioService) {
		this.clienteSocket = clienteSocket;
		this.minioService = minioService;
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

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> modificarTripulante(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String solicitud = "MODIFICAR_TRIPULANTE|" + token + "|" + id + "|" + cuerpo.getOrDefault("estado", "ACTIVO") + "|" + cuerpo.getOrDefault("sexo", "M") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura") + "|" + cuerpo.getOrDefault("nombre", "") + "|" + cuerpo.getOrDefault("apellido", "") + "|" + cuerpo.getOrDefault("imagen", "");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, Object>> darDeBajaTripulante(@PathVariable int id, @RequestHeader("Authorization") String token) {
		String solicitud = "BAJA_TRIPULANTE|" + token + "|" + id;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}
}
