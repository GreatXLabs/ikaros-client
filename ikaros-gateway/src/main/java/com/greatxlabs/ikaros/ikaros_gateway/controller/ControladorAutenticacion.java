package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.dto.RespuestaProtocolo;
import com.greatxlabs.ikaros.ikaros_gateway.service.RegistradorLogs;
import com.greatxlabs.ikaros.ikaros_gateway.service.SesionGateway;
import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class ControladorAutenticacion {

	private final ClienteSocketIkaros clienteSocket;
	private final RegistradorLogs registradorLogs;
	private final SesionGateway sesionGateway;

	public ControladorAutenticacion(ClienteSocketIkaros clienteSocket, RegistradorLogs registradorLogs, SesionGateway sesionGateway) {
		this.clienteSocket = clienteSocket;
		this.registradorLogs = registradorLogs;
		this.sesionGateway = sesionGateway;
	}

	@PostMapping("/login")
	public ResponseEntity<Map<String, Object>> iniciarSesion(@RequestBody Map<String, String> cuerpo) {
		String usuario = cuerpo.get("usuario");
		String clave = cuerpo.get("clave");

		String solicitud = "LOGIN|" + usuario + "|" + clave;
		RespuestaProtocolo respuesta = RespuestaProtocolo.desdeRespuestaCruda(clienteSocket.enviarSolicitud(solicitud));

		if (respuesta.esExitosa()) {
			String datos = respuesta.getDatos();
			String[] partes = datos.split("\\|");
			String token = partes[0];
			String rol = partes.length > 1 ? partes[1] : "";
			int usuarioID = partes.length > 2 ? Integer.parseInt(partes[2]) : 0;

			sesionGateway.registrar(token, usuarioID, rol);
			registradorLogs.registrar(usuarioID, RegistradorLogs.ACC_INICIO_SESION, RegistradorLogs.ENT_USUARIO, usuarioID);

			return ResponseEntity.ok(Map.of("success", true, "token", token, "rol", rol));
		}

		return ResponseEntity.status(401).body(respuesta.aCuerpoRespuesta());
	}
}
