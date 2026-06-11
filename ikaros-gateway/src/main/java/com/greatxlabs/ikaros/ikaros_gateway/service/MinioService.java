package com.greatxlabs.ikaros.ikaros_gateway.service;

import io.minio.GetObjectArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.errors.MinioException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.UUID;

@Service
public class MinioService {

    private final MinioClient minioClient;
    private final String bucket;

    public MinioService(MinioClient minioClient, @Value("${minio.bucket}") String bucket) {
        this.minioClient = minioClient;
        this.bucket = bucket;
    }

    public String subirImagen(MultipartFile archivo) {
        if (archivo.isEmpty()) {
            throw new IllegalArgumentException("Archivo vacío");
        }

        try {
            String nombreOriginal = archivo.getOriginalFilename();
            String extension = "";
            if (nombreOriginal != null && nombreOriginal.contains(".")) {
                extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            }
            String nombreArchivo = UUID.randomUUID().toString() + extension;
            String objectName = "tripulantes/" + nombreArchivo;

            String contentType = detectarContentType(extension);

            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .stream(archivo.getInputStream(), archivo.getSize(), -1)
                    .contentType(contentType)
                    .build());

            return "/uploads/" + objectName;
        } catch (MinioException | IOException | InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al subir imagen a MinIO: " + e.getMessage(), e);
        }
    }

    public InputStream obtenerImagen(String rutaRelativa) {
        try {
            String objectName = rutaRelativa.replaceFirst("^/uploads/", "");
            return minioClient.getObject(GetObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (MinioException | IOException | InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al obtener imagen desde MinIO: " + e.getMessage(), e);
        }
    }

    public void eliminarImagen(String rutaRelativa) {
        try {
            String objectName = rutaRelativa.replaceFirst("^/uploads/", "");
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucket)
                    .object(objectName)
                    .build());
        } catch (MinioException | IOException | InvalidKeyException | NoSuchAlgorithmException e) {
            throw new RuntimeException("Error al eliminar imagen de MinIO: " + e.getMessage(), e);
        }
    }

    private String detectarContentType(String extension) {
        return switch (extension.toLowerCase()) {
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            case ".gif" -> "image/gif";
            case ".webp" -> "image/webp";
            default -> "application/octet-stream";
        };
    }
}
