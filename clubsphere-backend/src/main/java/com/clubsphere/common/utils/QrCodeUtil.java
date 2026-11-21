package com.clubsphere.common.utils;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;
import java.util.Base64;

public class QrCodeUtil {

    public static byte[] generateQrCodeImage(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Could not generate QR code: " + e.getMessage(), e);
        }
    }

    public static String generateQrCodeBase64(String text, int width, int height) {
        byte[] imageBytes = generateQrCodeImage(text, width, height);
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }
}
