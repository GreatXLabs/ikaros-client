package com.greatxlabs.ikaros.ikaros_gateway.service;

import com.greatxlabs.ikaros.ikaros_gateway.socket.ClienteSocketIkaros;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class RegistradorLogs {

	private static final Logger log = LoggerFactory.getLogger(RegistradorLogs.class);

	// AccionID - Tabla Acciones
	public static final int ACC_CREAR_MISION = 1;
	public static final int ACC_MODIFICAR_MISION = 2;
	public static final int ACC_CANCELAR_MISION = 3;
	public static final int ACC_FINALIZAR_MISION = 4;
	public static final int ACC_ASIGNAR_TRIP_MISION = 5;
	public static final int ACC_REGISTRAR_EVENTO = 6;
	public static final int ACC_DESESTIMAR_EVENTO = 7;
	public static final int ACC_ALTA_TRIPULANTE = 8;
	public static final int ACC_MODIFICAR_TRIPULANTE = 9;
	public static final int ACC_BAJA_TRIPULANTE = 10;
	public static final int ACC_ASIGNAR_APTITUD = 11;
	public static final int ACC_MODIFICAR_CALIFICACION = 12;
	public static final int ACC_ALTA_USUARIO = 13;
	public static final int ACC_MODIFICAR_USUARIO = 14;
	public static final int ACC_INICIO_SESION = 15;
	public static final int ACC_CIERRE_SESION = 16;

	// TipoEntidadID - Tabla Entidades
	public static final int ENT_MISION = 1;
	public static final int ENT_TRIPULANTE = 2;
	public static final int ENT_EVENTO = 3;
	public static final int ENT_USUARIO = 4;
	public static final int ENT_CAPACIDAD = 5;

	private final ClienteSocketIkaros clienteSocket;

	public RegistradorLogs(ClienteSocketIkaros clienteSocket) {
		this.clienteSocket = clienteSocket;
	}

	public void registrar(int usuarioID, int accionID, int tipoEntidadID, int entidadID) {
		registrar(usuarioID, accionID, tipoEntidadID, entidadID, null);
	}

	public void registrar(int usuarioID, int accionID, int tipoEntidadID, int entidadID, String descripcion) {
		String base = "REGISTRAR_LOG|log|" + usuarioID + "|" + accionID + "|" + tipoEntidadID + "|" + entidadID;
		String solicitud = descripcion != null ? base + "|" + descripcion : base;
		try {
			String respuesta = clienteSocket.enviarSolicitud(solicitud);
			if (respuesta == null || !respuesta.startsWith("OK")) {
				log.warn("No se pudo registrar log: {}", respuesta);
			}
		} catch (Exception e) {
			log.error("Error enviando log al server: {}", e.getMessage());
		}
	}
}
