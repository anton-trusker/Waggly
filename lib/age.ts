export type AgeParts = { years: number; months: number };

export function getAgeParts(birthDate: Date): AgeParts {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months };
}

export function formatAge(birthDate: Date): string {
  const { years, months } = getAgeParts(birthDate);
  const y = `${years} year${years !== 1 ? 's' : ''}`;
  const m = `${months} month${months !== 1 ? 's' : ''}`;
  return `${y} ${m}`;
}

