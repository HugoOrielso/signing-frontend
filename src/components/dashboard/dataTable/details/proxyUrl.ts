const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function docProxyUrl(token: string | null | undefined, docId: string) {
    return `${API_BASE}/contracts/public/${token}/documents/${docId}/view`;
}
