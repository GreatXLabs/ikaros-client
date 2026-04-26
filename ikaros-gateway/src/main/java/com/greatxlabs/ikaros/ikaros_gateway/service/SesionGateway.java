package com.greatxlabs.ikaros.ikaros_gateway.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class SesionGateway {

	private static class DatosSesion {
		int usuarioID;
		String rol;

		DatosSesion(int usuarioID, String rol) {
			this.usuarioID = usuarioID;
			this.rol = rol;
		}
	}

	private final Map<String, DatosSesion> sesiones = new HashMap<>();

	public void registrar(String token, int usuarioID, String rol) {
		sesiones.put(token, new DatosSesion(usuarioID, rol));
	}

	public Integer obtenerUsuarioID(String token) {
		DatosSesion sesion = sesiones.get(token);
		return sesion != null ? sesion.usuarioID : null;
	}

	public String obtenerRol(String token) {
		DatosSesion sesion = sesiones.get(token);
		return sesion != null ? sesion.rol : null;
	}

	public void eliminar(String token) {
		sesiones.remove(token);
	}
}
