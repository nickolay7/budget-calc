#!/bin/bash

# macOS
osascript -e 'display notification "Claude ждёт вашего ввода" with title "Claude Code"'

# Linux (раскомментируйте нужное)
# notify-send "Claude Code" "Claude ждёт вашего ввода"

#Windows (PowerShell) — добавьте команду напрямую в хук:
#[Windows.UI.Notifications.ToastNotificationManager, Windows.UI.Notifications, ContentType = WindowsRuntime] | Out-Null
# ... стандартный PowerShell toast notification