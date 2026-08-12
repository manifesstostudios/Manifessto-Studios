package com.manifessto.backend.controller;

import com.manifessto.backend.service.CloudinaryService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/uploads")
@CrossOrigin(origins = "http://localhost:5173")
public class ImageUploadController {

    private final CloudinaryService cloudinaryService;

    public ImageUploadController(
            CloudinaryService cloudinaryService
    ) {
        this.cloudinaryService = cloudinaryService;
    }

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("image") MultipartFile image
    ) {

        try {

            String imageUrl =
                    cloudinaryService.uploadImage(image);

            return ResponseEntity.ok(
                    Map.of(
                            "url", imageUrl,
                            "message",
                            "Image uploaded successfully"
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            Map.of(
                                    "message",
                                    "Image upload failed"
                            )
                    );
        }
    }
}