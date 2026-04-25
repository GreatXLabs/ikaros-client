package com.greatxlabs.ikaros.ikaros_gateway.dto;

import java.util.Map;

public class RespuestaProtocolo {

    private final boolean exitosa;
    private final String codigoError;
    private final String mensaje;
    private final String datos;

    private RespuestaProtocolo(boolean exitosa, String codigoError, String mensaje, String datos) {
        this.exitosa = exitosa;
        this.codigoError = codigoError;
        this.mensaje = mensaje;
        this.datos = datos;
    }

    public static RespuestaProtocolo desdeRespuestaCruda(String cruda) {
        if (cruda == null || cruda.isEmpty()) {
            return new RespuestaProtocolo(false, "E99", "Respuesta vacía del servidor", null);
        }

        String[] partes = cruda.split("\\|", 4);

        if (partes[0].equals("OK")) {
            String datos = partes.length > 1 ? cruda.substring(3) : "";
            return new RespuestaProtocolo(true, null, "OK", datos);
        }

        if (partes[0].equals("ERROR") && partes.length >= 3) {
            return new RespuestaProtocolo(false, partes[1], partes[2], null);
        }

        return new RespuestaProtocolo(false, "E99", "Formato de respuesta desconocido: " + cruda, null);
    }

    public boolean esExitosa() { return exitosa; }
    public String getCodigoError() { return codigoError; }
    public String getMensaje() { return mensaje; }
    public String getDatos() { return datos; }

    public Map<String, Object> aCuerpoRespuesta() {
        if (exitosa) {
            return Map.of("success", true, "data", datos != null ? datos : "");
        }
        return Map.of("success", false, "error", codigoError, "message", mensaje);
    }
}
