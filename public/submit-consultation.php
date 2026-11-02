<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store, max-age=0');

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function smtpReadResponse($socket): int
{
    $code = 0;

    while (($line = fgets($socket, 515)) !== false) {
        if (preg_match('/^(\d{3})([ -])/', $line, $matches) === 1) {
            $code = (int) $matches[1];
            if ($matches[2] === ' ') {
                break;
            }
        }
    }

    return $code;
}

function smtpCommand($socket, string $command, array $expectedCodes): bool
{
    if (fwrite($socket, $command . "\r\n") === false) {
        return false;
    }

    return in_array(smtpReadResponse($socket), $expectedCodes, true);
}

function sendmailSend(
    string $recipient,
    string $replyTo,
    string $encodedSubject,
    string $messageBody,
    string $fromAddress
): bool {
    if (!function_exists('proc_open') || !is_executable('/sbin/sendmail')) {
        return false;
    }

    $headers = [
        'Date: ' . date(DATE_RFC2822),
        'From: GrowNep Website <' . $fromAddress . '>',
        'To: ' . $recipient,
        'Reply-To: ' . $replyTo,
        'Subject: ' . $encodedSubject,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
    ];
    $payload = implode("\r\n", $headers) . "\r\n\r\n" . $messageBody . "\r\n";
    $descriptors = [
        0 => ['pipe', 'r'],
        1 => ['pipe', 'w'],
        2 => ['pipe', 'w'],
    ];
    $process = @proc_open(
        ['/sbin/sendmail', '-t', '-i', '-f', $fromAddress],
        $descriptors,
        $pipes
    );

    if (!is_resource($process)) {
        return false;
    }

    $written = fwrite($pipes[0], $payload);
    fclose($pipes[0]);
    stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    stream_get_contents($pipes[2]);
    fclose($pipes[2]);

    return $written !== false && proc_close($process) === 0;
}

function smtpSend(
    array $smtp,
    string $recipient,
    string $replyTo,
    string $encodedSubject,
    string $messageBody
): bool {
    $host = trim((string) ($smtp['host'] ?? ''));
    $port = (int) ($smtp['port'] ?? 465);
    $username = trim((string) ($smtp['username'] ?? ''));
    $password = (string) ($smtp['password'] ?? '');

    if (
        $host === '' || $port < 1 || $port > 65535 ||
        !filter_var($username, FILTER_VALIDATE_EMAIL) || $password === ''
    ) {
        return false;
    }

    $socket = @stream_socket_client(
        'ssl://' . $host . ':' . $port,
        $errorNumber,
        $errorMessage,
        15,
        STREAM_CLIENT_CONNECT
    );

    if ($socket === false) {
        return false;
    }

    stream_set_timeout($socket, 15);
    $success = smtpReadResponse($socket) === 220
        && smtpCommand($socket, 'EHLO digitalgb.grownep.com', [250])
        && smtpCommand($socket, 'AUTH LOGIN', [334])
        && smtpCommand($socket, base64_encode($username), [334])
        && smtpCommand($socket, base64_encode($password), [235])
        && smtpCommand($socket, 'MAIL FROM:<' . $username . '>', [250])
        && smtpCommand($socket, 'RCPT TO:<' . $recipient . '>', [250, 251])
        && smtpCommand($socket, 'DATA', [354]);

    if ($success) {
        $headers = [
            'Date: ' . date(DATE_RFC2822),
            'From: GrowNep Website <' . $username . '>',
            'To: ' . $recipient,
            'Reply-To: ' . $replyTo,
            'Subject: ' . $encodedSubject,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 8bit',
        ];
        $payload = implode("\r\n", $headers) . "\r\n\r\n" . $messageBody;
        $payload = preg_replace('/(^|\r\n)\./', '$1..', $payload) ?? $payload;
        $success = fwrite($socket, $payload . "\r\n.\r\n") !== false
            && smtpReadResponse($socket) === 250;
    }

    @smtpCommand($socket, 'QUIT', [221]);
    fclose($socket);

    return $success;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed']);
}

$allowedOrigin = 'https://digitalgb.grownep.com';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && $origin !== $allowedOrigin) {
    respond(403, ['ok' => false, 'error' => 'Invalid origin']);
}

$rawBody = file_get_contents('php://input');
if ($rawBody === false || $rawBody === '' || strlen($rawBody) > 20000) {
    respond(400, ['ok' => false, 'error' => 'Invalid request body']);
}

$data = json_decode($rawBody, true);
if (!is_array($data)) {
    respond(400, ['ok' => false, 'error' => 'Invalid JSON']);
}

$fullName = trim((string) ($data['fullName'] ?? ''));
$email = trim((string) ($data['email'] ?? ''));
$whatsapp = trim((string) ($data['whatsapp'] ?? ''));
$businessName = trim((string) ($data['businessName'] ?? ''));
$website = trim((string) ($data['website'] ?? ''));
$message = trim((string) ($data['message'] ?? ''));

if (
    $fullName === '' || strlen($fullName) > 120 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 254 ||
    $whatsapp === '' || strlen($whatsapp) > 40 ||
    $businessName === '' || strlen($businessName) > 160 ||
    strlen($website) > 500 ||
    strlen($message) > 2000
) {
    respond(422, ['ok' => false, 'error' => 'Please check the submitted details']);
}

if ($website !== '' && !filter_var($website, FILTER_VALIDATE_URL)) {
    respond(422, ['ok' => false, 'error' => 'Invalid website URL']);
}

$recipientConfig = dirname(__DIR__) . '/.consultation-recipient.php';
$deliveryConfig = is_readable($recipientConfig) ? require $recipientConfig : '';
$recipient = is_array($deliveryConfig)
    ? trim((string) ($deliveryConfig['recipient'] ?? ''))
    : trim((string) $deliveryConfig);
if (!is_string($recipient) || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    respond(503, ['ok' => false, 'error' => 'Email delivery is not configured']);
}

$cleanHeaderValue = static function (string $value): string {
    return trim((string) preg_replace('/[\r\n]+/', ' ', $value));
};

$safeBusinessName = $cleanHeaderValue($businessName);
$subject = 'New consultation request: ' . $safeBusinessName;
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

$bodyLines = [
    'New Free AI Marketing Consultation Request',
    '==========================================',
    '',
    'Full name: ' . $fullName,
    'Active email: ' . $email,
    'WhatsApp number: ' . $whatsapp,
    'Business name: ' . $businessName,
    'Website or Facebook URL: ' . ($website !== '' ? $website : 'Not provided'),
    '',
    'Message:',
    $message !== '' ? $message : 'Not provided',
    '',
    'Submitted from: https://digitalgb.grownep.com/',
    'Submitted at: ' . gmdate('Y-m-d H:i:s') . ' UTC',
];

$messageBody = wordwrap(implode("\r\n", $bodyLines), 78);
$smtpConfig = is_array($deliveryConfig) && is_array($deliveryConfig['smtp'] ?? null)
    ? $deliveryConfig['smtp']
    : null;

$fromAddress = $smtpConfig !== null
    ? trim((string) ($smtpConfig['username'] ?? ''))
    : 'no-reply@digitalgb.grownep.com';

if (filter_var($fromAddress, FILTER_VALIDATE_EMAIL) && is_executable('/sbin/sendmail')) {
    $sent = sendmailSend(
        $recipient,
        $cleanHeaderValue($email),
        $encodedSubject,
        $messageBody,
        $fromAddress
    );
} elseif ($smtpConfig !== null) {
    $sent = smtpSend(
        $smtpConfig,
        $recipient,
        $cleanHeaderValue($email),
        $encodedSubject,
        $messageBody
    );
} elseif (function_exists('mail')) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'From: GrowNep Website <no-reply@digitalgb.grownep.com>',
        'Reply-To: ' . $cleanHeaderValue($email),
        'X-Mailer: PHP/' . PHP_VERSION,
    ];

    $sent = mail(
        $recipient,
        $encodedSubject,
        $messageBody,
        implode("\r\n", $headers)
    );
} else {
    respond(503, ['ok' => false, 'error' => 'Authenticated email delivery is required']);
}

if (!$sent) {
    respond(502, ['ok' => false, 'error' => 'Email delivery failed']);
}

respond(200, ['ok' => true]);
