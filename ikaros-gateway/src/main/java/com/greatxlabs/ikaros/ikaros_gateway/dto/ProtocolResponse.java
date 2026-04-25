package com.greatxlabs.ikaros.ikaros_gateway.dto;

import java.util.Map;

public class ProtocolResponse {

    private final boolean ok;
    private final String errorCode;
    private final String message;
    private final String data;

    private ProtocolResponse(boolean ok, String errorCode, String message, String data) {
        this.ok = ok;
        this.errorCode = errorCode;
        this.message = message;
        this.data = data;
    }

    public static ProtocolResponse from(String raw) {
        if (raw == null || raw.isEmpty()) {
            return new ProtocolResponse(false, "E99", "Respuesta vacía del servidor", null);
        }

        String[] parts = raw.split("\\|", 4);

        if (parts[0].equals("OK")) {
            String data = parts.length > 1 ? raw.substring(3) : "";
            return new ProtocolResponse(true, null, "OK", data);
        }

        if (parts[0].equals("ERROR") && parts.length >= 3) {
            return new ProtocolResponse(false, parts[1], parts[2], null);
        }

        return new ProtocolResponse(false, "E99", "Formato de respuesta desconocido: " + raw, null);
    }

    public boolean isOk() { return ok; }
    public String getErrorCode() { return errorCode; }
    public String getMessage() { return message; }
    public String getData() { return data; }

    public Map<String, Object> toBody() {
        if (ok) {
            return Map.of("success", true, "data", data != null ? data : "");
        }
        return Map.of("success", false, "error", errorCode, "message", message);
    }
}
