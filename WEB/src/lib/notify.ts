import { exec } from 'node:child_process';

const OPENCLAW_HOST = '172.28.18.89';
const OPENCLAW_USER = 'mauricio';
const OPENCLAW_BIN = '/home/mauricio/.npm-global/bin/openclaw';
const SSH_KEY = '/home/mauricio/.ssh/id_rsa';
const WHATSAPP_TARGET = '+573174377422';

/**
 * Sends a WhatsApp notification via OpenClaw on a remote server.
 * Non-blocking — fires and forgets. Never throws.
 */
export function notifyWhatsApp(message: string): void {
  const escaped = message.replace(/"/g, '\\"').replace(/\n/g, '\\n');
  const cmd = `ssh -i ${SSH_KEY} -o IdentitiesOnly=yes -o StrictHostKeyChecking=no -o ConnectTimeout=5 ${OPENCLAW_USER}@${OPENCLAW_HOST} "${OPENCLAW_BIN} message send --channel whatsapp --target ${WHATSAPP_TARGET} --message \\"${escaped}\\""`;

  exec(cmd, { timeout: 15000 }, (err) => {
    if (err) console.error('[notify] WhatsApp notification failed:', err.message);
  });
}
