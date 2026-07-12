package com.greatxlabs.ikaros.ikaros_gateway.controller;

import com.greatxlabs.ikaros.ikaros_gateway.service.MinioService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;

@RestController
public class ControladorArchivos {

    private final MinioService minioService;

    public ControladorArchivos(MinioService minioService) {
        this.minioService = minioService;
    }

    @GetMapping("/uploads/{carpeta}/{nombreArchivo:.+}")
    public ResponseEntity<InputStreamResource> servirArchivo(
            @PathVariable String carpeta,
            @PathVariable String nombreArchivo) {
        String ruta = "/uploads/" + carpeta + "/" + nombreArchivo;

        try {
            InputStream imagen = minioService.obtenerImagen(ruta);
            MediaType mediaType = determinarMediaType(nombreArchivo);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(new InputStreamResource(imagen));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private MediaType determinarMediaType(String nombreArchivo) {
        if (nombreArchivo == null) return MediaType.APPLICATION_OCTET_STREAM;
        String lower = nombreArchivo.toLowerCase();
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".gif")) return MediaType.IMAGE_GIF;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}
