import { execFile } from 'node:child_process';

const OPENCLAW_HOST = '172.28.18.89';
const OPENCLAW_USER = 'mauricio';
const OPENCLAW_BIN = '/home/mauricio/.npm-global/bin/openclaw';
const SSH_KEY = '/home/mauricio/.ssh/id_rsa';
const WHATSAPP_TARGETS = ['+573174377422', '+31623825981'];

/**
 * Sends a WhatsApp notification via OpenClaw to all targets.
 * Uses execFile (not exec) to prevent shell injection.
 * Non-blocking — fires and forgets. Never throws.
 */
export function notifyWhatsApp(message: string): void {
  for (const target of WHATSAPP_TARGETS) {
    execFile('ssh', [
      '-i', SSH_KEY,
      '-o', 'IdentitiesOnly=yes',
      '-o', 'StrictHostKeyChecking=no',
      '-o', 'ConnectTimeout=5',
      `${OPENCLAW_USER}@${OPENCLAW_HOST}`,
      OPENCLAW_BIN, 'message', 'send',
      '--channel', 'whatsapp',
      '--target', target,
      '--message', message,
    ], { timeout: 15000 }, (err) => {
      if (err) console.error(`[notify] WhatsApp to ${target} failed:`, err.message);
    });
  }
}
