package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tripulantes")
public class ControladorTripulantes {

	private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/tripulantes/";

	private final ClienteSocketIkaros clienteSocket;
	private final RegistradorLogs registradorLogs;
	private final SesionGateway sesionGateway;

	public ControladorTripulantes(ClienteSocketIkaros clienteSocket, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
		this.clienteSocket = clienteSocket;
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

	@PostMapping("/imagen")
	public ResponseEntity<Map<String, Object>> subirImagen(@RequestParam("imagen") MultipartFile archivo) {
		if (archivo.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Archivo vacío"));
		}

		try {
			String nombreOriginal = archivo.getOriginalFilename();
			String extension = "";
			if (nombreOriginal != null && nombreOriginal.contains(".")) {
				extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
			}
			String nombreArchivo = UUID.randomUUID().toString() + extension;

			Path dirPath = Paths.get(UPLOAD_DIR);
			Files.createDirectories(dirPath);

			Path filePath = dirPath.resolve(nombreArchivo);
			archivo.transferTo(filePath.toFile());

			String path = "/uploads/tripulantes/" + nombreArchivo;
			return ResponseEntity.ok(Map.of("success", true, "path", path));
		} catch (IOException e) {
			e.printStackTrace();
			return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error al guardar la imagen: " + e.getMessage()));
		}
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> registrarTripulante(@RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String solicitud = "REGISTRAR_TRIPULANTE|" + token + "|" + cuerpo.getOrDefault("sexo", "M") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura") + "|" + cuerpo.getOrDefault("nombre", "") + "|" + cuerpo.getOrDefault("apellido", "") + "|" + cuerpo.getOrDefault("imagen", "");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_ALTA_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, 0);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}

	@PutMapping("/{id}")
	public ResponseEntity<Map<String, Object>> modificarTripulante(@PathVariable int id, @RequestBody Map<String, String> cuerpo, @RequestHeader("Authorization") String token) {
		String solicitud = "MODIFICAR_TRIPULANTE|" + token + "|" + id + "|" + cuerpo.getOrDefault("estado", "ACTIVO") + "|" + cuerpo.getOrDefault("sexo", "M") + "|" + cuerpo.get("fechaNacimiento") + "|" + cuerpo.get("peso") + "|" + cuerpo.get("altura") + "|" + cuerpo.getOrDefault("nombre", "") + "|" + cuerpo.getOrDefault("apellido", "") + "|" + cuerpo.getOrDefault("imagen", "");
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			Integer usuarioID = sesionGateway.obtenerUsuarioID(token);
			if (usuarioID != null) {
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_MODIFICAR_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, id);
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
				registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_BAJA_TRIPULANTE, RegistradorLogs.ENT_TRIPULANTE, id);
			}
		}

		return ResponseEntity.ok(respuesta.aCuerpoRespuesta());
	}
}
