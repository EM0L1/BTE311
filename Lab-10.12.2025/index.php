<?php
// Basit sabit kimlik bilgileri
$validUsername = 'emincan';
$validPassword = '12345';

$message = '';
$messageClass = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if ($username === $validUsername && $password === $validPassword) {
        $message = 'Başarılı! Giriş yapıldı.';
        $messageClass = 'success';
    } else {
        $message = 'Başarısız! Kullanıcı adı veya şifre hatalı.';
        $messageClass = 'error';
    }
}
?>
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lab 10.12.2025 - Giriş Formu</title>
    <style>
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            min-height: 100vh;
            font-family: Arial, Helvetica, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }
        .card {
            width: 100%;
            max-width: 420px;
            background: #fff;
            border-radius: 12px;
            padding: 28px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);
        }
        h1 {
            margin: 0 0 16px;
            color: #333;
            font-size: 24px;
            text-align: center;
        }
        .form-group {
            margin-bottom: 14px;
        }
        label {
            display: block;
            margin-bottom: 6px;
            color: #444;
            font-weight: 600;
        }
        input[type="text"],
        input[type="password"] {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #d0d0d0;
            border-radius: 8px;
            font-size: 14px;
        }
        input[type="text"]:focus,
        input[type="password"]:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
        }
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 8px;
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            cursor: pointer;
            transition: transform 0.1s ease, box-shadow 0.1s ease;
        }
        button:hover {
            box-shadow: 0 8px 20px rgba(102, 126, 234, 0.35);
        }
        button:active {
            transform: translateY(1px);
        }
        .message {
            margin-top: 14px;
            padding: 10px 12px;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
        }
        .message.success {
            background: #e6ffed;
            color: #1e7c3a;
            border: 1px solid #b7f5c6;
        }
        .message.error {
            background: #ffe6e6;
            color: #b22727;
            border: 1px solid #f5b7b7;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>Giriş Yap</h1>
        <form method="post">
            <div class="form-group">
                <label for="username">Kullanıcı Adı</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Şifre</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Gönder</button>
        </form>
        <?php if ($message): ?>
            <div class="message <?php echo htmlspecialchars($messageClass); ?>">
                <?php echo htmlspecialchars($message); ?>
            </div>
        <?php endif; ?>
    </div>

    <div class="card" style="margin-top: 16px;">
        <h1>1-100 Sayıları</h1>
        <table style="width:100%; border-collapse: collapse; text-align:center; font-size:14px;">
            <tbody>
                <?php for ($i = 1; $i <= 100; $i++): ?>
                    <?php if ($i % 10 === 1): ?><tr><?php endif; ?>
                        <td style="border:1px solid #e0e0e0; padding:6px;"><?php echo $i; ?></td>
                    <?php if ($i % 10 === 0): ?></tr><?php endif; ?>
                <?php endfor; ?>
            </tbody>
        </table>
    </div>
</body>
</html>

