// Hardcoded admin user IDs — add your user ID here
const ADMIN_IDS = [
  "82549190-bc3f-4ad4-9ad8-339832d8250e", // keyq
];

export function isAdmin(userId: string): boolean {
  return ADMIN_IDS.includes(userId);
}
