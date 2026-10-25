// "2026-11-10T00:00:00.000Z" -> "10/11/2026" (sem depender de fuso horário)
export function formatDate(iso: string) {
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}