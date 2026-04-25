package com.greatxlabs.ikaros.ikaros_gateway.socket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;

@Component
public class IkarosSocketClient {

    private final String host;
    private final int port;

    public IkarosSocketClient(
            @Value("${ikaros.server.host}") String host,
            @Value("${ikaros.server.port}") int port) {
        this.host = host;
        this.port = port;
    }

    public String enviar(String mensaje) {
        try (Socket socket = new Socket(host, port);
             BufferedReader entrada = new BufferedReader(new InputStreamReader(socket.getInputStream()));
             PrintWriter salida = new PrintWriter(socket.getOutputStream(), true)) {

            salida.println(mensaje);
            return entrada.readLine();

        } catch (Exception e) {
            return "ERROR|E99|No se pudo conectar con el servidor: " + e.getMessage();
        }
    }
}
