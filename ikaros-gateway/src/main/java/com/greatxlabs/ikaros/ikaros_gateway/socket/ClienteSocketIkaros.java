package com.greatxlabs.ikaros.ikaros_gateway.socket;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetSocketAddress;
import java.net.Socket;

@Component
public class ClienteSocketIkaros {

    private final String host;
    private final int puerto;

    public ClienteSocketIkaros(
            @Value("${ikaros.server.host}") String host,
            @Value("${ikaros.server.port}") int puerto) {
        this.host = host;
        this.puerto = puerto;
    }

    public String enviarSolicitud(String mensaje) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress(host, puerto), 5000);
            socket.setSoTimeout(5000);

            BufferedReader entrada = new BufferedReader(new InputStreamReader(socket.getInputStream()));
            PrintWriter salida = new PrintWriter(socket.getOutputStream(), true);

            salida.println(mensaje);
            return entrada.readLine();

        } catch (Exception e) {
            return "ERROR|E99|No se pudo conectar con el servidor: " + e.getMessage();
        }
    }
}
