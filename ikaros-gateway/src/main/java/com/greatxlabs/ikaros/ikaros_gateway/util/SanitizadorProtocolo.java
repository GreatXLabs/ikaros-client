package com.greatxlabs.ikaros.ikaros_gateway.util;

public class SanitizadorProtocolo {

    private SanitizadorProtocolo() {
    }

    public static String sanitizar(String texto) {
        if (texto == null) {
            return null;
        }
        return texto.replace("\r", " ").replace("\n", " ").replace("\t", " ");
    }
}
