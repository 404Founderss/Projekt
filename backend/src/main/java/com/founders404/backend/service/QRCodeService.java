package com.founders404.backend.service;

import com.founders404.backend.model.Product;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

/**
 * QR kód generálás.
 */
@Service
@RequiredArgsConstructor
public class QRCodeService {

    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;
    private static final String QR_CODE_DIRECTORY = "qrcodes/";

    /**
     * QR kód generálás szövegből.
     * text = QR kódba kódolandó szöveg
     * width = szélesség pixelben
     * height = magasság pixelben
     * return = PNG byte array
     */
    public byte[] generateQRCode(String text, int width, int height) throws WriterException, IOException {
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }

    /**
     * Termék QR kód generálás.
     * JSON formátumban tartalmazza a termék adatokat.
     * return = PNG byte array
     */
    public byte[] generateProductQRCode(Product product) throws WriterException, IOException {
        String qrContent = buildProductQRContent(product);
        return generateQRCode(qrContent, QR_CODE_WIDTH, QR_CODE_HEIGHT);
    }

    /**
     * Termék QR tartalom építése.
     * Formátum: JSON-szerű string vagy egyedi formátum.
     */
    private String buildProductQRContent(Product product) {
        // Opció 1: JSON formátum
        return String.format(
                "{\"id\":%d,\"name\":\"%s\",\"sku\":\"%s\",\"barcode\":\"%s\",\"price\":%.2f}",
                product.getId(),
                product.getName(),
                product.getSku() != null ? product.getSku() : "",
                product.getBarcode() != null ? product.getBarcode() : "",
                product.getNetSellingPrice() != null ? product.getNetSellingPrice() : 0.0
        );

        // Opció 2: Egyszerű URL (ha web alapú lenne)
        // return "https://yourapp.com/products/" + product.getId();
    }

    /**
     * QR kód mentése fájlként.
     */
    public String saveQRCodeAsFile(Product product) throws WriterException, IOException {
        byte[] qrCodeBytes = generateProductQRCode(product);

        // Könyvtár létrehozása, ha nem létezik
        Path directory = Paths.get(QR_CODE_DIRECTORY);
        if (!Files.exists(directory)) {
            Files.createDirectories(directory);
        }

        // Fájl útvonal
        String fileName = "product_" + product.getId() + ".png";
        Path filePath = directory.resolve(fileName);

        // Mentés
        Files.write(filePath, qrCodeBytes);

        return filePath.toString();
    }

    /**
     * QR kód Base64 string-ként.
     * Adatbázisba mentéshez.
     * return = Base64 encoded string
     */
    public String generateQRCodeAsBase64(Product product) throws WriterException, IOException {
        byte[] qrCodeBytes = generateProductQRCode(product);
        return Base64.getEncoder().encodeToString(qrCodeBytes);
    }

    /**
     * QR kód betöltése fájlból.
     * return = PNG byte array vagy null
     */
    public byte[] loadQRCodeFromFile(Long productId) throws IOException {
        String fileName = "product_" + productId + ".png";
        Path filePath = Paths.get(QR_CODE_DIRECTORY).resolve(fileName);

        if (Files.exists(filePath)) {
            return Files.readAllBytes(filePath);
        }
        return null;
    }

    /**
     * QR kód dekódolása byte arrayba.
     */
    public byte[] decodeBase64QRCode(String base64QRCode) {
        return Base64.getDecoder().decode(base64QRCode);
    }
}
