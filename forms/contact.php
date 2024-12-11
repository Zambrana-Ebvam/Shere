<?php
require 'phpmailer/src/PHPMailer.php';
require 'phpmailer/src/SMTP.php';
require 'phpmailer/src/Exception.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


// Cargar PHPMailer
require 'vendor/autoload.php'; // Asegúrate de que este archivo exista después de instalar PHPMailer

// Dirección de correo del hospital para responder al usuario
$hospital_email = "hygeiahostpital@gmail.com";
$hospital_name = "Hospital Virtual Hygeia";

// Verifica si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Obtener datos enviados desde el formulario
    $name = htmlspecialchars($_POST['name']); // Nombre del usuario
    $email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL); // Correo del usuario
    $subject = htmlspecialchars($_POST['subject']); // Asunto del formulario
    $message = htmlspecialchars($_POST['message']); // Mensaje del formulario

    // Verifica que todos los campos estén llenos
    if ($name && $email && $subject && $message) {
        // Crear un nuevo objeto PHPMailer
        $mail = new PHPMailer(true);

        try {
            // Configuración del servidor SMTP
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // Servidor SMTP de Gmail
            $mail->SMTPAuth = true;
            $mail->Username = $hospital_email; // Tu dirección de Gmail
            $mail->Password = 'ysss howb nhci xoyb'; // Contraseña de la aplicación
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Encriptación SSL/TLS
            $mail->Port = 465; // Puerto SMTP seguro para Gmail

            // Configurar correo
            $mail->setFrom($hospital_email, $hospital_name); // Correo y nombre del hospital
            $mail->addAddress($email, $name); // Correo y nombre del usuario

            // Contenido del correo
            $mail->isHTML(true); // Configura el formato del correo como HTML
            $mail->Subject = "Gracias por contactarnos, $name";
            $mail->Body = "
                <p>Hola $name,</p>
                <p>¡Gracias por contactarnos en el Hospital Virtual Hygeia! Hemos recibido tu mensaje con los siguientes detalles:</p>
                <ul>
                    <li><strong>Asunto:</strong> $subject</li>
                    <li><strong>Mensaje:</strong> $message</li>
                </ul>
                <p>Nuestro equipo te contactará en breve para agendar tu cita y resolver tus dudas. Mientras tanto, si tienes una emergencia, no dudes en llamarnos al +591 123 456 789.</p>
                <p>Atentamente,<br>Equipo de Hygeia</p>
            ";

            // Enviar el correo
            $mail->send();
            echo json_encode([
                "status" => "success",
                "message" => "¡Gracias! Tu mensaje ha sido enviado. Hemos enviado un correo de confirmación a $email."
            ]);
        } catch (Exception $e) {
            echo json_encode([
                "status" => "error",
                "message" => "No se pudo enviar el correo. Error: {$mail->ErrorInfo}"
            ]);
        }
    } else {
        // Error por datos incompletos
        echo json_encode([
            "status" => "error",
            "message" => "Por favor, completa todos los campos del formulario."
        ]);
    }
} else {
    // Método no permitido
    echo json_encode([
        "status" => "error",
        "message" => "Método no permitido. Usa el formulario para enviar los datos."
    ]);
}
?>
